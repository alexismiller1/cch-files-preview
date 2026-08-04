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

/** Per-file-type contextual actions shown in the ActionMenu and file preview "Try this next" list, each routed to the app that handles it. */
export const CONTEXT_ACTIONS: Partial<Record<FileKind, { label: string; icon: MnemonicKind }[]>> = {
  image: [
    { label: "Convert this image to video", icon: "firefly" },
    { label: "Generate image with reference", icon: "firefly" },
    { label: "Remove objects", icon: "firefly" },
    { label: "Generate a new image layer", icon: "photoshop" },
    { label: "Make quick adjustments", icon: "photoshop" },
    { label: "Select objects", icon: "photoshop" },
  ],
  "firefly-image": [
    { label: "Add an image effect", icon: "firefly" },
  ],
  pdf: [
    { label: "Chat with this document", icon: "acrobat" },
    { label: "Summarize key points", icon: "acrobat" },
    { label: "Edit the text", icon: "acrobat" },
    { label: "Request signatures", icon: "acrobat" },
    { label: "Convert to Microsoft Office", icon: "acrobat" },
    { label: "Combine files", icon: "acrobat" },
  ],
  video: [
    { label: "Upscale video", icon: "firefly" },
    { label: "Translate video", icon: "firefly" },
  ],
  express: [
    { label: "Add design elements", icon: "express" },
    { label: "Add media", icon: "express" },
    { label: "Generate video clip", icon: "express" },
    { label: "Generate new image", icon: "express" },
    { label: "Add text effect", icon: "express" },
    { label: "Organize data", icon: "express" },
  ],
  illustrator: [
    { label: "Add to Express file", icon: "express" },
  ],
  photoshop: [
    { label: "Convert to video", icon: "firefly" },
    { label: "Generate image with reference", icon: "firefly" },
    { label: "Remove objects", icon: "photoshop" },
    { label: "Generate new objects", icon: "photoshop" },
    { label: "Generate new image layer", icon: "photoshop" },
    { label: "Make quick adjustments", icon: "photoshop" },
  ],
};

/** App a "Try these actions" quick action routes to, keyed by its mnemonic icon. */
export const MNEMONIC_APP_NAME: Record<MnemonicKind, string> = {
  firefly: "Firefly",
  photoshop: "Photoshop",
  acrobat: "Acrobat",
  express: "Express",
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
