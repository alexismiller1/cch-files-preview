/**
 * OpenAI Types
 * Type definitions for Firefly 3p LLM API
 */

// Content types for messages (3p API format)
export interface TextContent {
  type: 'text'
  text: string
}

export interface ImageSource {
  id: string
}

export interface ImageContent {
  type: 'image'
  source: ImageSource
}

export type MessageContent = TextContent | ImageContent

// Message structure (3p API format)
// Note: 3p LLM API supports: 'user', 'assistant', 'developer', 'tool'
// 'system' role is NOT supported - use 'developer' instead
export interface OpenAIMessage {
  role: 'user' | 'assistant' | 'developer' | 'tool' | 'system'
  content: MessageContent[] | string
}

// Alias for compatibility
export type LLMMessage = OpenAIMessage

// Output schema for structured responses
export interface OutputSchemaProperty {
  type: string
  description?: string
  enum?: string[]
}

export interface OutputSchema {
  type: 'object'
  properties: Record<string, OutputSchemaProperty>
  required?: string[]
}

// Request types
export interface LLMGenerateRequest {
  modelId: string
  modelVersion: string
  messages: OpenAIMessage[]
  temperature?: number
  outputSchema?: OutputSchema
}

export interface OpenAICompletionOptions {
  modelId: string      // REQUIRED - The LLM model provider family
  modelVersion: string // REQUIRED - The version of the LLM
  temperature?: number
  outputSchema?: OutputSchema
}

// Alias for compatibility
export type LLMGenerateOptions = OpenAICompletionOptions

// Response types
export interface LLMGenerateResponse {
  links: {
    result: {
      href: string
    }
  }
}

export interface JobProgressResponse {
  links: {
    result: {
      href: string
    }
    cancel?: {
      href: string
    }
  }
  status: 'IN_PROGRESS' | 'PENDING'
  progress?: number
}

// LLM job result - raw response from the API
export interface LLMJobResult {
  modelId: string
  modelVersion: string
  choices: Array<{
    message: {
      role: string
      content: MessageContent[] | string
    }
    finishReason?: string
  }>
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  [key: string]: unknown // Allow additional fields
}

export type JobResult = LLMJobResult | JobProgressResponse

// Image upload response (for uploading images to 3p storage)
export interface OpenAIImageUploadResponse {
  images: Array<{ id: string }>
}
