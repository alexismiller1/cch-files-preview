// Export base API client
export { createApiClient } from './apiClient';

// Export API registry functions
export * from './apiRegistry';
import { registerApi } from './apiRegistry';

// Export OpenAI API service
export * as openai from './openai/openaiService';

// Export constants (avoid ENDPOINTS name conflicts)
export {
  OPENAI_API,
  LLM_MODELS,
  LLM_MODEL_VERSIONS,
  ENDPOINTS as OPENAI_ENDPOINTS
} from './openai/openaiConstants';

// Export Firefly API service
export * from './firefly/fireflyService';
export * from './firefly/fireflyConstants';
export * from './firefly/fireflyTypes';

// Export Stock API service
export * from './stock/stockService';
export * from './stock/stockConstants';
export * from './stock/stockTypes';

// Export Adobe 3P API service
export * as thirdparty from './adobe3p/thirdpartyService';
export {
  THIRDPARTY_API,
  IMAGE_MODELS,
  VIDEO_MODELS,
  MODEL_VERSIONS,
  REFERENCE_BLOB_USAGE,
  SEMANTIC_USAGE,
  DEFAULT_SIZE,
  ENDPOINTS as THIRDPARTY_ENDPOINTS
} from './adobe3p/thirdpartyConstants';
// Note: thirdpartyTypes are not exported at top level to avoid conflicts with other services (e.g., Size type)
// Access types via: import type { ... } from './adobe3p/thirdpartyTypes'

import {
  openaiClient,
  generateLLM,
  generateLLMAndWait,
  sendMessage,
  sendTextMessage,
  createImageContent,
  createTextContent,
  createUserMessage,
  createSimpleUserMessage,
  createOutputSchema,
  uploadImage as uploadOpenAIImage,
  uploadImageFromDataURL,
  dataURLToBlob
} from './openai/openaiService';
import { OPENAI_API } from './openai/openaiConstants';
import { fireflyClient, generate, generateV3, generateV4, generateBatch, uploadImage, uploadImageV3, uploadImageV4, uploadImageBatch, uploadVideoImage, generateSimilar, genfill, generateVideo, checkVideoStatus } from './firefly/fireflyService';
import { stockClient, searchStock, quickSearch } from './stock/stockService';
import { thirdpartyClient, generateImage as generateThirdPartyImage, generateVideo as generateThirdPartyVideo, getJobResult, pollJobUntilComplete, generateImageAndWait, generateVideoAndWait, createGenerationMetadata, createReferenceBlob, createGeminiFlashOptions } from './adobe3p/thirdpartyService';
import { THIRDPARTY_API } from './adobe3p/thirdpartyConstants';

// Register OpenAI API with the registry
registerApi('openai', {
  baseUrl: OPENAI_API.BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: OPENAI_API.DEFAULT_TIMEOUT,
  retries: OPENAI_API.DEFAULT_RETRIES
});

// Register Adobe 3P API with the registry
registerApi('thirdparty', {
  baseUrl: THIRDPARTY_API.BASE_URL,
  headers: THIRDPARTY_API.COMMON_HEADERS,
  timeout: THIRDPARTY_API.DEFAULT_TIMEOUT,
  retries: THIRDPARTY_API.DEFAULT_RETRIES
});

// Export convenience functions
export const apis = {
  openai: {
    client: openaiClient,
    generateLLM,
    generateLLMAndWait,
    sendMessage,
    createImageContent,
    createTextContent,
    sendTextMessage,
    createUserMessage,
    createSimpleUserMessage,
    createOutputSchema,
    uploadImage: uploadOpenAIImage,
    uploadImageFromDataURL,
    dataURLToBlob
  },
  firefly: {
    client: fireflyClient,
    generate,
    generateV3,
    generateV4,
    generateBatch,
    uploadImage,
    uploadImageV3,
    uploadImageV4,
    uploadImageBatch,
    uploadVideoImage,
    generateSimilar,
    genfill,
    generateVideo,
    checkVideoStatus
  },
  stock: {
    client: stockClient,
    searchStock,
    quickSearch
  },
  thirdparty: {
    client: thirdpartyClient,
    generateImage: generateThirdPartyImage,
    generateVideo: generateThirdPartyVideo,
    getJobResult,
    pollJobUntilComplete,
    generateImageAndWait,
    generateVideoAndWait,
    createGenerationMetadata,
    createReferenceBlob,
    createGeminiFlashOptions
  }
  
}; 