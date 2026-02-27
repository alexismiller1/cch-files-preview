/**
 * OPENAI SERVICE
 * Firefly 3p LLM API for OpenAI models
 * Uses the same auth pattern as adobe3p (Bearer token + x-api-key)
 * 
 * Main features:
 * - Requires IMS token + apiKey (Adobe auth)
 * - Images use 3p storage IDs instead of data URLs
 * - Async job-based responses (handled internally)
 */

import { registerApi, getApiClient } from '../apiRegistry'
import { OPENAI_API, ENDPOINTS } from './openaiConstants'
import type {
  LLMGenerateRequest,
  LLMGenerateResponse,
  OpenAICompletionOptions,
  OpenAIMessage,
  JobResult,
  LLMJobResult,
  JobProgressResponse,
  TextContent,
  ImageContent,
  OutputSchema,
  OpenAIImageUploadResponse
} from './openaiTypes'

// Common API configuration
const commonConfig = {
  headers: OPENAI_API.COMMON_HEADERS,
  timeout: OPENAI_API.DEFAULT_TIMEOUT,
  retries: OPENAI_API.DEFAULT_RETRIES
}

// Register OpenAI API with the registry
registerApi('openai', {
  baseUrl: OPENAI_API.STAGE_BASE_URL,
  ...commonConfig
})

// Get client instance
export const openaiClient = getApiClient('openai')

/**
 * Generate LLM completion using Firefly 3p API (async, returns job link)
 */
export async function generateLLM(
  messages: OpenAIMessage[],
  token: string,
  apiKey: string,
  options: OpenAICompletionOptions
): Promise<LLMGenerateResponse> {
  // Convert string content to array format and convert 'system' role to 'developer'
  // The 3p LLM API only supports: 'user', 'assistant', 'developer', 'tool'
  const formattedMessages = messages.map(msg => ({
    ...msg,
    role: msg.role === 'system' ? 'developer' : msg.role,
    content: typeof msg.content === 'string' 
      ? [{ type: 'text' as const, text: msg.content }]
      : msg.content
  }))

  const request: LLMGenerateRequest = {
    modelId: options.modelId,
    modelVersion: options.modelVersion,
    messages: formattedMessages,
    temperature: options.temperature,
    outputSchema: options.outputSchema
  }

  // Remove undefined optional fields
  if (request.temperature === undefined) delete request.temperature
  if (request.outputSchema === undefined) delete request.outputSchema

  return await openaiClient.post<LLMGenerateResponse>(
    ENDPOINTS.GENERATE_LLM,
    request,
    {
      'Authorization': `Bearer ${token}`,
      'x-api-key': apiKey
    }
  )
}

/**
 * Check job status and get results
 */
export async function getJobResult(jobId: string, token: string, apiKey: string): Promise<JobResult> {
  return await openaiClient.get<JobResult>(
    `${ENDPOINTS.JOB_RESULT}/${jobId}`,
    {},
    {
      'Authorization': `Bearer ${token}`,
      'x-api-key': apiKey
    }
  )
}

/**
 * Check if job is still in progress
 */
export function isJobInProgress(result: JobResult): result is JobProgressResponse {
  return 'status' in result && (result.status === 'IN_PROGRESS' || result.status === 'PENDING')
}

/**
 * Check if job result is an LLM result (completed)
 */
export function isLLMJobResult(result: JobResult): result is LLMJobResult {
  return 'choices' in result && Array.isArray(result.choices)
}

function isAbsoluteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value)
}

async function getJobResultByUrl(
  url: string,
  token: string,
  apiKey: string
): Promise<JobResult> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-api-key': apiKey
    }
  })

  let data: unknown
  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    data = await response.json()
  } else if (contentType?.includes('text/')) {
    data = await response.text()
  } else {
    data = {}
  }

  if (!response.ok) {
    const error = new Error(`API request failed with status ${response.status}`) as Error & {
      status?: number
      data?: unknown
    }
    error.status = response.status
    error.data = data
    throw error
  }

  return data as JobResult
}

/**
 * Poll job until completion
 */
export async function pollJobUntilComplete(
  jobId: string,
  token: string,
  apiKey: string,
  pollInterval: number = 2000,
  maxAttempts: number = 60
): Promise<LLMJobResult> {
  let attempts = 0

  while (attempts < maxAttempts) {
    const result = isAbsoluteUrl(jobId)
      ? await getJobResultByUrl(jobId, token, apiKey)
      : await getJobResult(jobId, token, apiKey)

    if (isLLMJobResult(result)) {
      return result
    }

    if (!isJobInProgress(result)) {
      throw new Error('Job failed or returned unexpected result')
    }

    attempts++
    await new Promise(resolve => setTimeout(resolve, pollInterval))
  }

  throw new Error(`Job polling timed out after ${maxAttempts} attempts`)
}

/**
 * Generate LLM completion and wait for result (handles polling internally)
 */
export async function generateLLMAndWait(
  messages: OpenAIMessage[],
  token: string,
  apiKey: string,
  options: OpenAICompletionOptions,
  pollInterval: number = 2000,
  maxAttempts: number = 60
): Promise<LLMJobResult> {
  const response = await generateLLM(messages, token, apiKey, options)
  const resultHref = response.links.result.href
  return await pollJobUntilComplete(resultHref, token, apiKey, pollInterval, maxAttempts)
}

/**
 * Helper to create a text content object
 */
export function createTextContent(text: string): TextContent {
  return {
    type: 'text',
    text
  }
}

/**
 * Helper to create an image content object with source ID
 * NOTE: This uses 3p storage IDs.
 * Use uploadImage() first to get an image ID from a blob/file.
 */
export function createImageContent(imageId: string): ImageContent {
  return {
    type: 'image',
    source: {
      id: imageId
    }
  }
}

/**
 * Helper to create a user message with mixed content
 */
export function createUserMessage(content: (TextContent | ImageContent)[]): OpenAIMessage {
  return {
    role: 'user',
    content
  }
}

/**
 * Helper to create a simple text user message
 */
export function createSimpleUserMessage(text: string): OpenAIMessage {
  return {
    role: 'user',
    content: text
  }
}

/**
 * Helper to create an output schema for structured responses
 */
export function createOutputSchema(
  properties: Record<string, { type: string; description?: string; enum?: string[] }>,
  required?: string[]
): OutputSchema {
  return {
    type: 'object',
    properties,
    required
  }
}

/**
 * Upload image to 3p storage for use in messages
 * Returns the image ID to use with createImageContent()
 */
export async function uploadImage(
  image: Blob,
  token: string,
  apiKey: string
): Promise<string> {
  const url = `${OPENAI_API.BASE_URL}/v2/storage/image`
  
  const response: OpenAIImageUploadResponse = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.setRequestHeader('x-api-key', apiKey)
    xhr.setRequestHeader('Content-Type', image.type)

    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText)
          resolve(data as OpenAIImageUploadResponse)
        } catch (e) {
          reject(new Error('Error parsing upload response'))
        }
      } else {
        reject(new Error(`HTTP error! status: ${xhr.status}, message: ${xhr.responseText}`))
      }
    }

    xhr.onerror = function() {
      reject(new Error('Network error during upload'))
    }

    xhr.send(image)
  })

  return response.images[0].id
}

/**
 * Helper to convert a data URL to a Blob for uploading
 */
export function dataURLToBlob(dataURL: string): Blob {
  const arr = dataURL.split(',')
  const mimeMatch = arr[0].match(/:(.*?);/)
  const mime = mimeMatch ? mimeMatch[1] : 'image/png'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

/**
 * Upload image from data URL (convenience wrapper)
 * Converts data URL to blob and uploads to 3p storage
 */
export async function uploadImageFromDataURL(
  dataURL: string,
  token: string,
  apiKey: string
): Promise<string> {
  const blob = dataURLToBlob(dataURL)
  return uploadImage(blob, token, apiKey)
}

/**
 * Send a message and get a response
 * 
 * Takes array of messages and returns the assistant's response.
 * 
 * Key features:
 * - Requires token and apiKey parameters (IMS auth)
 * - Images must use 3p storage IDs (upload first with uploadImage)
 */
export async function sendMessage(
  messages: OpenAIMessage[],
  token: string,
  apiKey: string,
  options: OpenAICompletionOptions
): Promise<OpenAIMessage> {
  const result = await generateLLMAndWait(messages, token, apiKey, options)
  
  // Extract response from choices array
  const choice = result.choices?.[0]
  const rawContent = choice?.message?.content
  
  // Content can be a string or an array of content objects
  let content: string
  if (typeof rawContent === 'string') {
    content = rawContent
  } else if (Array.isArray(rawContent)) {
    // Extract text from content array
    content = rawContent
      .filter((c: { type: string; text?: string }) => c.type === 'text')
      .map((c: { type: string; text?: string }) => c.text || '')
      .join('')
  } else {
    content = ''
  }
  
  return {
    role: 'assistant',
    content
  }
}

/**
 * Simple text-only sendMessage (convenience wrapper)
 */
export async function sendTextMessage(
  text: string,
  token: string,
  apiKey: string,
  options: OpenAICompletionOptions
): Promise<OpenAIMessage> {
  const messages: OpenAIMessage[] = [{ role: 'user', content: text }]
  return sendMessage(messages, token, apiKey, options)
}
