export type TopAppBarApp = {
  id: string;
  label: string;
};

/** Keep first occurrence of each id — duplicate ids would render duplicate “selected” tabs. */
export function dedupeAppsById(apps: TopAppBarApp[]): TopAppBarApp[] {
  const seen = new Set<string>();
  const out: TopAppBarApp[] = [];
  for (const a of apps) {
    if (seen.has(a.id)) continue;
    seen.add(a.id);
    out.push(a);
  }
  return out;
}

/** Apps shown in the "more" contextual menu (not in the default bar) */
export const MORE_APPS: TopAppBarApp[] = [
  { id: "stock", label: "Adobe Stock" },
  { id: "fonts", label: "Adobe Fonts" },
];

export const DEFAULT_APPS: TopAppBarApp[] = [
  { id: "home", label: "Adobe Home" },
  { id: "firefly", label: "Firefly" },
  { id: "express", label: "Express" },
  { id: "photoshop", label: "Photoshop" },
  { id: "lightroom", label: "Lightroom" },
  { id: "acrobat", label: "Acrobat" },
  { id: "frameio", label: "Frame.io" },
];
