import ImageIcon from "@react-spectrum/s2/icons/Image";
import VideoIcon from "@react-spectrum/s2/icons/Video";
import type { MnemonicKind } from "../components/MnemonicIcons";
import psAppIcon from "../assets/adobe-mnemonics/ps_appicon.svg";
import acrobatAppIcon from "../assets/adobe-mnemonics/acrobat_reader_appicon.svg";
import expressAppIcon from "../assets/adobe-mnemonics/adobeexpress_appicon.svg";
import illustratorAppIcon from "../assets/adobe-mnemonics/ai_appicon.svg";
import fireflyAppIcon from "../assets/adobe-mnemonics/fi_appicon.svg";
import thumb01 from "../assets/files-thumbnails/thumb-01.jpg";
import thumb02 from "../assets/files-thumbnails/thumb-02.jpg";
import thumb03 from "../assets/files-thumbnails/thumb-03.jpg";
import thumb06 from "../assets/files-thumbnails/thumb-06.jpg";
import thumb07 from "../assets/files-thumbnails/thumb-07.jpg";
import pdfPlaceholder from "../assets/files-thumbnails/pdf-placeholder.svg";
import videoPlaceholder from "../assets/files-thumbnails/video-placeholder.svg";
import expressPlaceholder from "../assets/files-thumbnails/express-placeholder.svg";
import illustratorPlaceholder from "../assets/files-thumbnails/illustrator-placeholder.svg";
import fireflyImagePlaceholder from "../assets/files-thumbnails/firefly-image-placeholder.svg";
import fireflyBoardPlaceholder from "../assets/files-thumbnails/firefly-board-placeholder.svg";
import addChartsGridsIcon from "../assets/create-action-icons/add-charts-grids.png";
import addDesignElementsIcon from "../assets/create-action-icons/add-design-elements.png";
import addMediaIcon from "../assets/create-action-icons/add-media.png";
import adjustColorLightingIcon from "../assets/create-action-icons/adjust-color-lighting.png";
import adjustObjectIcon from "../assets/create-action-icons/adjust-object.png";
import applyPresetIcon from "../assets/create-action-icons/apply-preset.png";
import chatWithPdfIcon from "../assets/create-action-icons/chat-with-pdf.png";
import combineFilesIcon from "../assets/create-action-icons/combine-files-to-pdf-acrobat.png";
import convertAicToExpressIcon from "../assets/create-action-icons/convert-aic-to-express.png";
import editTextImgAcrobatIcon from "../assets/create-action-icons/edit-text-img-acrobat.png";
import genFillPhotoshopIcon from "../assets/create-action-icons/gen-fill-photoshop.png";
import genFillRemoveObjectIcon from "../assets/create-action-icons/gen-fill-remove-object.png";
import generateImageExpressIcon from "../assets/create-action-icons/generate-image-express.png";
import generateImagePhotoshopIcon from "../assets/create-action-icons/generate-image-photoshop.png";
import generateVideoExpressIcon from "../assets/create-action-icons/generate-video-express.png";
import imageReferenceIcon from "../assets/create-action-icons/image-reference.png";
import imageToVideoIcon from "../assets/create-action-icons/image-to-video.png";
import pdfToWordIcon from "../assets/create-action-icons/pdf-to-word.png";
import psQuickActionsIcon from "../assets/create-action-icons/ps-quick-actions.png";
import removeObjectPhotoshopIcon from "../assets/create-action-icons/remove-object-photoshop.png";
import requestSignaturesAcrobatIcon from "../assets/create-action-icons/request-signatures-acrobat.png";
import summarizePdfIcon from "../assets/create-action-icons/summarize-pdf.png";
import textEffectsIcon from "../assets/create-action-icons/text-effects.png";
import translateVideoIcon from "../assets/create-action-icons/translate-video.png";
import upscaleVideoIcon from "../assets/create-action-icons/upscale-video.png";

export type FileKind = "image" | "pdf" | "video" | "express" | "photoshop" | "illustrator" | "firefly-image" | "firefly-board";

export const KIND_FORMAT: Record<FileKind, string> = {
  image: "JPG",
  pdf: "PDF",
  video: "MP4",
  express: "Adobe Express",
  photoshop: "PSDC",
  illustrator: "AIDC",
  "firefly-image": "Image",
  "firefly-board": "board",
};

export type FileEntry = { id: string; name: string; modified: string; thumbnail: string; kind: FileKind };

/** Primary editing app for each file kind — raw photos/video default to Photoshop. */
export const EDIT_APP_NAME: Record<FileKind, string> = {
  image: "Photoshop",
  video: "Photoshop",
  pdf: "Acrobat",
  express: "Express",
  photoshop: "Photoshop",
  illustrator: "Illustrator",
  "firefly-image": "Firefly",
  "firefly-board": "Firefly Boards",
};

export type ContextAction = { label: string; icon: MnemonicKind; image?: string };

/**
 * Per-file-type contextual actions shown in the ActionMenu and file preview "Try this next" list, each
 * routed to the app that handles it. `image`, when present, overrides the generic app mnemonic (`icon`)
 * with a specific uploaded action icon — `icon` is still kept for app-name routing (MNEMONIC_APP_NAME).
 */
export const CONTEXT_ACTIONS: Partial<Record<FileKind, ContextAction[]>> = {
  image: [
    { label: "Convert this image to video", icon: "firefly", image: imageToVideoIcon },
    { label: "Generate image with reference", icon: "firefly", image: imageReferenceIcon },
    { label: "Remove objects", icon: "firefly", image: genFillRemoveObjectIcon },
    { label: "Generate a new image layer", icon: "photoshop", image: generateImagePhotoshopIcon },
    { label: "Make quick adjustments", icon: "photoshop", image: adjustColorLightingIcon },
    { label: "Select objects", icon: "photoshop", image: adjustObjectIcon },
  ],
  "firefly-image": [
    { label: "Add an image effect", icon: "ai-assistant", image: applyPresetIcon },
  ],
  pdf: [
    { label: "Chat with this document", icon: "acrobat", image: chatWithPdfIcon },
    { label: "Summarize key points", icon: "acrobat", image: summarizePdfIcon },
    { label: "Edit the text", icon: "acrobat", image: editTextImgAcrobatIcon },
    { label: "Request signatures", icon: "acrobat", image: requestSignaturesAcrobatIcon },
    { label: "Convert to Microsoft Office", icon: "acrobat", image: pdfToWordIcon },
    { label: "Combine files", icon: "acrobat", image: combineFilesIcon },
  ],
  video: [
    { label: "Upscale video", icon: "firefly", image: upscaleVideoIcon },
    { label: "Translate video", icon: "firefly", image: translateVideoIcon },
  ],
  express: [
    { label: "Add design elements", icon: "express", image: addDesignElementsIcon },
    { label: "Add media", icon: "express", image: addMediaIcon },
    { label: "Generate video clip", icon: "express", image: generateVideoExpressIcon },
    { label: "Generate new image", icon: "express", image: generateImageExpressIcon },
    { label: "Add text effect", icon: "express", image: textEffectsIcon },
    { label: "Organize data", icon: "express", image: addChartsGridsIcon },
  ],
  illustrator: [
    { label: "Add to Express file", icon: "express", image: convertAicToExpressIcon },
  ],
  photoshop: [
    { label: "Convert to video", icon: "firefly", image: imageToVideoIcon },
    { label: "Generate image with reference", icon: "firefly", image: imageReferenceIcon },
    { label: "Remove objects", icon: "photoshop", image: removeObjectPhotoshopIcon },
    { label: "Generate new objects", icon: "photoshop", image: genFillPhotoshopIcon },
    { label: "Generate new image layer", icon: "photoshop", image: generateImagePhotoshopIcon },
    { label: "Make quick adjustments", icon: "photoshop", image: psQuickActionsIcon },
  ],
};

/** App a "Try these actions" quick action routes to, keyed by its mnemonic icon. */
export const MNEMONIC_APP_NAME: Record<MnemonicKind, string> = {
  firefly: "Firefly",
  photoshop: "Photoshop",
  acrobat: "Acrobat",
  express: "Express",
  "ai-assistant": "Firefly",
};

export type ExtraOpenAction = { label: string; icon: "boards" | "firefly"; appName: string };

/**
 * Per-kind "Open actions" beyond the plain "Open" item, shared by the card's ActionMenu and the
 * file preview modal header so both surfaces always offer the same set of open actions.
 */
export const EXTRA_OPEN_ACTIONS: Partial<Record<FileKind, ExtraOpenAction[]>> = {
  image: [
    { label: "Open in Boards", icon: "boards", appName: "Firefly Boards" },
    { label: "Edit in Firefly", icon: "firefly", appName: "Firefly" },
  ],
  video: [
    { label: "Open in Boards", icon: "boards", appName: "Firefly Boards" },
    { label: "Edit in Firefly", icon: "firefly", appName: "Firefly" },
  ],
  photoshop: [
    { label: "Open in Boards", icon: "boards", appName: "Firefly Boards" },
  ],
  illustrator: [
    { label: "Open in Boards", icon: "boards", appName: "Firefly Boards" },
  ],
};

/** Kinds whose extra open actions replace the plain "Open" item entirely rather than sitting alongside it. */
export const KINDS_WITHOUT_GENERIC_OPEN: FileKind[] = ["image", "video"];

export type OpenMenuItem = { label: string; appName: string };

/**
 * Per-kind items for Option 5's consolidated "Open in ___" split button. The first item is both
 * the default action (fired by pressing the button body) and the button's own visible label —
 * the button always reads as "Open in <app>", never a generic "Open"/"Open in". The dropdown lists
 * every item, including that first/default one, so re-selecting it is still possible.
 */
export const CONSOLIDATED_OPEN_CONFIG: Record<FileKind, OpenMenuItem[]> = {
  image: [
    { label: "Open in Firefly", appName: "Firefly" },
    { label: "Open in Boards", appName: "Firefly Boards" },
    { label: "Open in Photoshop web", appName: "Photoshop" },
    { label: "Open in Lightroom desktop", appName: "Lightroom" },
  ],
  pdf: [
    { label: "Open in Acrobat web", appName: "Acrobat" },
    { label: "Open in Acrobat desktop", appName: "Acrobat" },
  ],
  video: [
    { label: "Open in Firefly", appName: "Firefly" },
    { label: "Open in Boards", appName: "Firefly Boards" },
    { label: "Open in Premiere desktop", appName: "Premiere" },
  ],
  express: [{ label: "Open in Express", appName: "Express" }],
  photoshop: [
    { label: "Open in Photoshop web", appName: "Photoshop" },
    { label: "Open in Photoshop desktop", appName: "Photoshop" },
    { label: "Open in Firefly", appName: "Firefly" },
    { label: "Open in Boards", appName: "Firefly Boards" },
  ],
  illustrator: [
    { label: "Open in Illustrator", appName: "Illustrator" },
    { label: "Open in Firefly", appName: "Firefly" },
    { label: "Open in Boards", appName: "Firefly Boards" },
  ],
  "firefly-image": [{ label: "Open in Firefly", appName: "Firefly" }],
  "firefly-board": [{ label: "Open in Boards", appName: "Firefly Boards" }],
};

/** Shared file list — reused by the Files grid and the Home page's "Recent files" panel. */
export const FILES: FileEntry[] = [
  { id: "1", name: "Office lobby photo", modified: "2 days ago", thumbnail: thumb01, kind: "image" },
  { id: "2", name: "Brand guidelines", modified: "2 days ago", thumbnail: pdfPlaceholder, kind: "pdf" },
  { id: "3", name: "Walkthrough video", modified: "2 days ago", thumbnail: videoPlaceholder, kind: "video" },
  { id: "4", name: "Social media post", modified: "3 days ago", thumbnail: expressPlaceholder, kind: "express" },
  { id: "5", name: "Sprinkles anniversary", modified: "3 days ago", thumbnail: thumb02, kind: "photoshop" },
  { id: "6", name: "Logo concept", modified: "4 days ago", thumbnail: illustratorPlaceholder, kind: "illustrator" },
  { id: "7", name: "Reception concept", modified: "4 days ago", thumbnail: thumb03, kind: "photoshop" },
  { id: "8", name: "Image", modified: "5 days ago", thumbnail: fireflyImagePlaceholder, kind: "firefly-image" },
  { id: "9", name: "Board", modified: "5 days ago", thumbnail: fireflyBoardPlaceholder, kind: "firefly-board" },
  { id: "10", name: "Studio hallway", modified: "6 days ago", thumbnail: thumb06, kind: "photoshop" },
  { id: "11", name: "Glass facade study", modified: "6 days ago", thumbnail: thumb07, kind: "photoshop" },
];

export function FileBadge({ kind }: { kind: FileKind }) {
  if (kind === "image") {
    return (
      <span className="files-card-badge files-card-badge--icon">
        <ImageIcon />
      </span>
    );
  }
  if (kind === "video") {
    return (
      <span className="files-card-badge files-card-badge--icon">
        <VideoIcon />
      </span>
    );
  }
  const mnemonic =
    kind === "pdf"
      ? acrobatAppIcon
      : kind === "express"
        ? expressAppIcon
        : kind === "illustrator"
          ? illustratorAppIcon
          : kind === "firefly-image" || kind === "firefly-board"
            ? fireflyAppIcon
            : psAppIcon;
  return <img src={mnemonic} alt="" className="files-card-badge" />;
}

/** Same per-kind icon selection as FileBadge (generic S2 icon for image/video, app mnemonic otherwise), sized for larger contexts like the file preview modal header. */
export function FileKindIcon({ kind, className }: { kind: FileKind; className?: string }) {
  if (kind === "image") return <span className={className}><ImageIcon /></span>;
  if (kind === "video") return <span className={className}><VideoIcon /></span>;
  const mnemonic =
    kind === "pdf"
      ? acrobatAppIcon
      : kind === "express"
        ? expressAppIcon
        : kind === "illustrator"
          ? illustratorAppIcon
          : kind === "firefly-image" || kind === "firefly-board"
            ? fireflyAppIcon
            : psAppIcon;
  return <img src={mnemonic} alt="" className={className} />;
}
