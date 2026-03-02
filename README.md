# PPK Template Starter

A React + Vite starter template with React Spectrum S2.

## Prerequisites

- Node.js (see `.nvmrc` for version)
- pnpm

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Scripts

- `pnpm dev` - Start dev server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run TypeScript and ESLint checks

## Layout picker

The app starts on a layout picker page where you can browse available layouts, preview them, and copy a prompt to apply one via the AI chat.

After a layout has been applied to `src/App.tsx`, you can still get back to the picker by adding `?picker` to the URL (e.g. `https://localhost:8080/?picker`). This works because the picker check lives in `src/main.tsx`, which is not overwritten when layouts are applied.

## Blueline accessibility overlay

In development mode, the Blueline accessibility overlay is loaded but hidden by default. Press **Ctrl+Shift+A** to toggle it. The overlay visualizes landmarks, headings, tab order, ARIA attributes, form labels, and live regions on the page.

## Support

For questions and support, join the [#adp-protopack](https://adobe.enterprise.slack.com/archives/C08QHHYC5SR) Slack channel.
