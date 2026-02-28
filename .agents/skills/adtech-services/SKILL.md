---
name: adtech-services
description: Discover and integrate @adtech service packages in Protopack projects. Use when users ask to list available services, use Adobe APIs (Firefly, Photoshop, Lightroom, etc.), or configure authentication.
---

# AdTech Services

Use this skill when a user asks about available Adobe services or needs help integrating @adtech packages.

**Note**: These are internal Adobe packages without public documentation. Discover available methods by inspecting the package source and TypeScript types directly.

## Package overview

The primary package is `@adtech/protopack-services-all`, which provides a unified `apis` object for accessing Adobe services.

```typescript
import { apis } from '@adtech/protopack-services-all';
```

## Available services

Known services in the package (inspect the package for the full, up-to-date listing):

| Service | Description |
|---------|-------------|
| `apis.firefly` | Firefly API (image generation, upscaling, expand, fill) |
| `apis.ps` | Photoshop API (actions, smart objects, layer operations) |
| `apis.lightroom` | Lightroom API (presets, auto-tone, masking) |
| `apis.digitalImaging` | Digital imaging services |
| `apis.adobe3p` | Third-party Adobe services |

## Workflow

### 1) Discovering services

When a user asks what services are available:
1. Check the project's `node_modules/@adtech/protopack-services-all` for the actual exports
2. Inspect the package's type definitions or source to list available APIs
3. Report which services are available and their methods

### 2) Using services

Guide users to import and use the `apis` object:

```typescript
import { apis } from '@adtech/protopack-services-all';

// Example: Firefly image generation
const result = await apis.firefly.generate({
  prompt: 'A sunset over mountains',
  // ... other options
});

// Example: Photoshop operations
const psResult = await apis.ps.applyActions({
  // ... options
});
```

### 3) Adding new services

If a service doesn't exist in `@adtech/protopack-services-all`:
1. Check if other `@adtech/*` packages provide the needed functionality
2. If not available in any @adtech package, inform the user

## Authentication

For all Adobe API calls, credentials come from IMS (not separate environment variables):

```typescript
import { useIMS } from '../contexts/useIMS';

const ims = useIMS();
const token = ims.tokenData?.token;      // Bearer token for Authorization header
const apiKey = ims.adobeid.client_id;    // x-api-key header
```

The @adtech services typically handle auth internally when IMS is configured in the project.

**Important**: Do not introduce service-specific API key environment variables when IMS is available.