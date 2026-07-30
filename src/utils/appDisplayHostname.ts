/**
 * Hostname shown in the faux Safari / browser chrome for each product tab.
 * Adobe Home → adobe.com (+ /{homeNavId} for the selected primary nav page); other Adobe apps → {id}.adobe.com; Frame.io → frame.io.
 */
export function displayHostnameForAppId(appId: string, homeNavId?: string): string {
  if (appId === "home") {
    const path = homeNavId && homeNavId !== "home" ? `/${homeNavId}` : "";
    return `adobe.com${path}`;
  }
  if (appId === "frameio") return "frame.io";
  return `${appId}.adobe.com`;
}
