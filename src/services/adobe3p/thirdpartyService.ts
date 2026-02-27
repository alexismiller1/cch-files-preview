/**
 * THIRDPARTY SERVICE
 * Adobe 3P Image and Video Model API
 * Wiki: https://wiki.corp.adobe.com/display/GenAI/API%3A+3P+Image+and+Video+Model
 */


import { registerApi, getApiClient } from '../apiRegistry'
import { THIRDPARTY_API, ENDPOINTS } from './thirdpartyConstants'
import type {
  ThirdPartyImageGenerateRequest,
  ThirdPartyVideoGenerateRequest,
  ThirdPartyGenerateResponse,
  JobResult,
  ThirdPartyImageGenerateOptions,
  ThirdPartyVideoGenerateOptions,
  ImageJobResult,
  VideoJobResult,
  JobProgressResponse,
  ThirdPartyImageUploadResponse
} from './thirdpartyTypes'

// Common API configuration
const commonConfig = {
  headers: THIRDPARTY_API.COMMON_HEADERS,
  timeout: THIRDPARTY_API.DEFAULT_TIMEOUT,
  retries: THIRDPARTY_API.DEFAULT_RETRIES
}

// Register ThirdParty API with the registry
registerApi('thirdparty', {
  baseUrl: THIRDPARTY_API.BASE_URL,
  ...commonConfig
})

// Get client instance
export const thirdpartyClient = getApiClient('thirdparty')

/**
 * Generate image using third-party models
 */
export async function generateImage(
  prompt: string,
  token: string,
  apiKey: string,
  options: ThirdPartyImageGenerateOptions = { modelId: 'flux' }
): Promise<ThirdPartyGenerateResponse> {
  const request: ThirdPartyImageGenerateRequest = {
    prompt,
    ...options
  }

  return await thirdpartyClient.post<ThirdPartyGenerateResponse>(
    ENDPOINTS.GENERATE_IMAGE,
    request,
    {
      'Authorization': `Bearer ${token}`,
      'x-api-key': apiKey
    }
  )
}

/**
 * Generate video using third-party models
 */
export async function generateVideo(
  prompt: string,
  token: string,
  apiKey: string,
  options: ThirdPartyVideoGenerateOptions = { modelId: 'veo' }
): Promise<ThirdPartyGenerateResponse> {
  const request: ThirdPartyVideoGenerateRequest = {
    prompt,
    ...options
  }

  return await thirdpartyClient.post<ThirdPartyGenerateResponse>(
    ENDPOINTS.GENERATE_VIDEO,
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
  return await thirdpartyClient.get<JobResult>(
    `${ENDPOINTS.JOB_RESULT}/${jobId}`,
    {}, // queryParams
    {   // customHeaders
      'Authorization': `Bearer ${token}`,
      'x-api-key': apiKey
    }
  )
}

/**
 * Check if job is still in progress
 */
export function isJobInProgress(result: JobResult): result is JobProgressResponse {
  return 'progress' in result && typeof result.progress === 'number'
}

/**
 * Check if job result is an image result
 */
export function isImageJobResult(result: JobResult): result is ImageJobResult {
  return 'contentType' in result && (result.contentType === 'image/png' || result.contentType === 'image/jpeg')
}

/**
 * Check if job result is a video result
 */
export function isVideoJobResult(result: JobResult): result is VideoJobResult {
  return 'contentType' in result && (
    result.contentType === 'video/mp4' || 
    result.contentType === 'video/webm' || 
    result.contentType === 'video/quicktime'
  )
}

/**
 * Poll job until completion
 */
export async function pollJobUntilComplete(
  jobId: string,
  token: string,
  apiKey: string,
  pollInterval: number = 2000,
  maxAttempts: number = 30
): Promise<ImageJobResult | VideoJobResult> {
  let attempts = 0
  
  while (attempts < maxAttempts) {
    const result = await getJobResult(jobId, token, apiKey)
    
    if (isImageJobResult(result) || isVideoJobResult(result)) {
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
 * Generate image and wait for completion
 */
export async function generateImageAndWait(
  prompt: string,
  token: string,
  apiKey: string,
  options: ThirdPartyImageGenerateOptions = { modelId: 'flux' },
  pollInterval: number = 2000,
  maxAttempts: number = 30
): Promise<ImageJobResult> {
  const response = await generateImage(prompt, token, apiKey, options)
  const jobId = extractJobIdFromHref(response.links.result.href)
  const result = await pollJobUntilComplete(jobId, token, apiKey, pollInterval, maxAttempts)
  
  if (!isImageJobResult(result)) {
    throw new Error('Expected image result but got video result')
  }
  
  return result
}

/**
 * Generate video and wait for completion
 */
export async function generateVideoAndWait(
  prompt: string,
  token: string,
  apiKey: string,
  options: ThirdPartyVideoGenerateOptions = { modelId: 'veo' },
  pollInterval: number = 2000,
  maxAttempts: number = 30
): Promise<VideoJobResult> {
  const response = await generateVideo(prompt, token, apiKey, options)
  const jobId = extractJobIdFromHref(response.links.result.href)
  const result = await pollJobUntilComplete(jobId, token, apiKey, pollInterval, maxAttempts)
  
  if (!isVideoJobResult(result)) {
    throw new Error('Expected video result but got image result')
  }
  
  return result
}

/**
 * Extract job ID from result href
 */
function extractJobIdFromHref(href: string): string {
  const match = href.match(/\/jobs\/result\/([^/]+)$/)
  if (!match) {
    throw new Error(`Invalid job result href: ${href}`)
  }
  return match[1]
}

/**
 * Helper function to create generation metadata
 */
export function createGenerationMetadata(options: {
  module?: string
  sourceDocumentId?: string
  filterString?: string
  originalPrompt?: string
}) {
  return {
    module: options.module,
    sourceDocumentId: options.sourceDocumentId,
    filterString: options.filterString,
    originalPrompt: options.originalPrompt
  }
}

/**
 * Helper function to create reference blob
 */
export function createReferenceBlob(options: {
  id: string
  usage: 'subject' | 'general' | 'nonGenRef' | 'unknown'
  promptReference?: number
}) {
  return {
    id: options.id,
    usage: options.usage,
    promptReference: options.promptReference
  }
}

/**
 * Helper function to create gemini-flash specific options
 * 
 * Example usage:
 * ```typescript
 * const options = createGeminiFlashOptions({
 *   prompt: "A man in casual dress standing by beach",
 *   n: 1,
 *   seeds: [1],
 *   referenceBlobs: [
 *     {
 *       id: "0dc6cdac-44f5-4890-8d83-131c38b58592",
 *       usage: "general"
 *     }
 *   ],
 *   storeInputs: false,
 *   module: "text2image"
 * })
 * 
 * const result = await generateImageAndWait(prompt, token, apiKey, options)
 * ```
 */
export function createGeminiFlashOptions(options: {
  prompt: string
  n?: number
  seeds?: number[]
  referenceBlobs?: Array<{
    id: string
    usage: 'general' | 'subject' | 'nonGenRef' | 'unknown'
  }>
  storeInputs?: boolean
  module?: string
}): ThirdPartyImageGenerateOptions {
  return {
    modelId: 'gemini-flash',
    modelVersion: 'nano-banana',
    n: options.n || 1,
    seeds: options.seeds || [1],
    output: {
      storeInputs: options.storeInputs || false
    },
    referenceBlobs: options.referenceBlobs,
    generationMetadata: {
      module: options.module || 'text2image'
    }
  }
}

/**
 * Helper function to scale image to fit within max dimensions
 */
function scaleToFit(width: number, height: number, maxDimension: number): { width: number; height: number } {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height }
  }

  const aspectRatio = width / height
  if (width > height) {
    return {
      width: maxDimension,
      height: Math.round(maxDimension / aspectRatio)
    }
  } else {
    return {
      width: Math.round(maxDimension * aspectRatio),
      height: maxDimension
    }
  }
}

/**
 * Upload image to 3P storage for use as reference
 * Uses BASE_URL for the storage endpoint
 * Returns the blob ID that can be used in referenceBlobs
 */
export async function uploadImage(
  image: Blob,
  token: string,
  apiKey: string,
  scaleImage = true
): Promise<ThirdPartyImageUploadResponse> {
  try {
    let uploadBlob = image
    
    if (scaleImage) {
      const bitmap = await createImageBitmap(image)
      if (bitmap.width > 2048 || bitmap.height > 2048) {
        const targetDimensions = scaleToFit(bitmap.width, bitmap.height, 2048)
        const canvas = new OffscreenCanvas(targetDimensions.width, targetDimensions.height)
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
          uploadBlob = await canvas.convertToBlob({ type: image.type })
        } else {
          console.warn(
            '3P image upload: failed to obtain 2D context for scaling; uploading original image without scaling.'
          )
        }
      }
      bitmap.close()
    }

    // Use BASE_URL and configured storage endpoint for storage
    const url = `${THIRDPARTY_API.BASE_URL}${ENDPOINTS.STORAGE_IMAGE}`
    console.log('Uploading to 3P storage:', url)

    const response: ThirdPartyImageUploadResponse = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', url, true)
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      xhr.setRequestHeader('x-api-key', apiKey)
      xhr.setRequestHeader('Content-Type', uploadBlob.type)

      xhr.onload = function() {
        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText)
            console.log('3P image upload success:', data)
            resolve(data as ThirdPartyImageUploadResponse)
          } catch (e) {
            console.error('Error parsing upload response:', e)
            reject(new Error('Error parsing upload response'))
          }
        } else {
          console.error('3P upload failed with status:', xhr.status)
          console.error('Response:', xhr.responseText)
          reject(new Error(`HTTP error! status: ${xhr.status}, message: ${xhr.responseText}`))
        }
      }

      xhr.onerror = function() {
        console.error('3P upload network error')
        reject(new Error('Network error during upload'))
      }

      xhr.send(uploadBlob)
    })

    return response
  } catch (e) {
    console.error('3P image upload error:', e)
    throw e
  }
} 