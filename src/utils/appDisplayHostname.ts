/**
 * Hostname shown in the faux Safari / browser chrome for each product tab.
 * Adobe Home → adobe.com; other Adobe apps → {id}.adobe.com; Frame.io → frame.io.
 */
export function displayHostnameForAppId(appId: string): string {
  if (appId === "home") return "adobe.com";
  if (appId === "frameio") return "frame.io";
  return `${appId}.adobe.com`;
}
