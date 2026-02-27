/**
 * OpenAI API Constants
 * Firefly 3p LLM API configurations
 */

export const OPENAI_API = {
  BASE_URL: 'https://firefall-gen-3p-colligov2-dev.corp.ethos851-stage-or2.ethos.adobe.net',
  STAGE_BASE_URL: 'https://firefly-3p-stage.ff.adobe.io',
  PROD_BASE_URL: 'https://firefly.adobe.io',
  DEFAULT_TIMEOUT: 60000,
  DEFAULT_RETRIES: 3,
  COMMON_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
} as const

// Model families (modelId)
export const LLM_MODELS = {
  GPT: 'gpt',
} as const

// Model versions (modelVersion) - use with corresponding modelId
export const LLM_MODEL_VERSIONS = {
  // GPT versions (use with modelId: 'gpt')
  GPT_4O: 'gpt-4o',
  GPT_4O_MINI: 'gpt-4o-mini',
  GPT_4_1: 'gpt-4.1',
  GPT_4_1_MINI: 'gpt-4.1-mini',
  GPT_4_1_NANO: 'gpt-4.1-nano',
  GPT_5: 'gpt-5',
  GPT_5_MINI: 'gpt-5-mini',
  GPT_5_2: 'gpt-5.2',
  GPT_5_1: 'gpt-5.1',
} as const

export const ENDPOINTS = {
  GENERATE_LLM: '/v2/3p-llm/generate-async',
  JOB_RESULT: '/jobs/result'
} as const
