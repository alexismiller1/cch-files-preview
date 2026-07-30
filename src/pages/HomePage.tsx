import { useState, type ReactNode } from "react";
import { ActionButton, ActionMenu, Button, Image, Menu, MenuItem, MenuSection, MenuTrigger, Text } from "@react-spectrum/s2";
import AddIcon from "@react-spectrum/s2/icons/Add";
import ViewListIcon from "@react-spectrum/s2/icons/ViewList";
import FolderIcon from "@react-spectrum/s2/icons/Folder";
import MagicWandIcon from "@react-spectrum/s2/icons/MagicWand";
import CloseIcon from "@react-spectrum/s2/icons/Close";
import OpenInIcon from "@react-spectrum/s2/icons/OpenIn";
import ArtboardIcon from "@react-spectrum/s2/icons/Artboard";
import ShareIcon from "@react-spectrum/s2/icons/Share";
import RenameIcon from "@react-spectrum/s2/icons/Rename";
import DownloadIcon from "@react-spectrum/s2/icons/Download";
import MoreIcon from "@react-spectrum/s2/icons/More";
import DeleteIcon from "@react-spectrum/s2/icons/Delete";
import { PhotoshopMnemonicIcon, ExpressMnemonicIcon } from "../components/MnemonicIcons";
import fireflyAppIcon from "../assets/adobe-mnemonics/fi_appicon.svg";
import psAppIcon from "../assets/adobe-mnemonics/ps_appicon.svg";
import expressAppIcon from "../assets/adobe-mnemonics/adobeexpress_appicon.svg";
import cardRemoveBg from "../assets/home-action-cards/card-remove-bg.png";
import cardResize from "../assets/home-action-cards/card-resize-3.png";
import cardAdjustments from "../assets/home-action-cards/card-adjustments-4.png";
import cardVideo from "../assets/home-action-cards/card-video.png";
import cardReference from "../assets/home-action-cards/card-reference.png";
import cardMoodboard from "../assets/home-action-cards/card-moodboard.png";
import expressDesignElements from "../assets/home-action-cards/express/express-design-elements.jpg";
import expressAddMedia from "../assets/home-action-cards/express/express-add-media.jpg";
import expressVideo from "../assets/home-action-cards/express/express-video.jpg";
import expressGenerateImage from "../assets/home-action-cards/express/express-generate-image.jpg";
import expressTextEffect from "../assets/home-action-cards/express/express-text-effect.jpg";
import expressOrganizeData from "../assets/home-action-cards/express/express-organize-data.jpg";
import acrobatAppIcon from "../assets/adobe-mnemonics/acrobat_reader_appicon.svg";
import pdfChat from "../assets/home-action-cards/pdf/pdf-chat.svg";
import pdfSummarize from "../assets/home-action-cards/pdf/pdf-summarize.svg";
import pdfEdit from "../assets/home-action-cards/pdf/pdf-edit.svg";
import pdfSignatures from "../assets/home-action-cards/pdf/pdf-signatures.svg";
import pdfConvert from "../assets/home-action-cards/pdf/pdf-convert.svg";
import pdfCombine from "../assets/home-action-cards/pdf/pdf-combine.svg";
import videoResize from "../assets/home-action-cards/video/video-resize.jpg";
import videoMoodboard from "../assets/home-action-cards/video/video-moodboard.jpg";
import videoSummarize from "../assets/home-action-cards/video/video-summarize.svg";
import psGenerateObjects from "../assets/home-action-cards/photoshop/ps-generate-objects.jpg";
import psImageLayer from "../assets/home-action-cards/photoshop/ps-image-layer.jpg";
import psAdjustments from "../assets/home-action-cards/photoshop/ps-adjustments.jpg";
import aiExport from "../assets/home-action-cards/illustrator/ai-export.svg";
import aiExpressLink from "../assets/home-action-cards/illustrator/ai-express-link.svg";
import { HomeDashboard } from "../components/HomeDashboard";
import { useSelectedApp } from "../context/SelectedAppContext";
import { FILES, FileBadge, KIND_FORMAT, type FileKind } from "../data/filesData";
import "./HomePage.css";

type ActionCardBrand = "ai" | "firefly" | "photoshop" | "express" | "acrobat";

type ActionCard = {
  image: string;
  before?: string;
  highlight: string;
  after?: string;
  brand: ActionCardBrand;
};

const BRAND_INFO: Record<ActionCardBrand, { icon: string | null; label: string }> = {
  ai: { icon: null, label: "AI Assistant" },
  firefly: { icon: fireflyAppIcon, label: "Adobe Firefly" },
  photoshop: { icon: psAppIcon, label: "Photoshop" },
  express: { icon: expressAppIcon, label: "Adobe Express" },
  acrobat: { icon: acrobatAppIcon, label: "Acrobat" },
};

/** App placeholder screen to open for non-AI-Assistant action cards, keyed by brand. */
const PLACEHOLDER_APP_NAME: Partial<Record<ActionCardBrand, string>> = {
  firefly: "Firefly",
  photoshop: "Photoshop",
  express: "Express",
  acrobat: "Acrobat",
};

function cardText(card: ActionCard): string {
  return `${card.before ?? ""}${card.highlight}${card.after ?? ""}`;
}

type RecentMenuAction = { id: string; label: string; icon: ReactNode };

const RECENT_OPEN: RecentMenuAction = { id: "open", label: "Open", icon: <OpenInIcon /> };
const RECENT_OPEN_IN_BOARDS: RecentMenuAction = { id: "open-boards", label: "Open in Boards", icon: <ArtboardIcon /> };
const RECENT_OPEN_IN_PHOTOSHOP: RecentMenuAction = { id: "open-photoshop", label: "Open in Photoshop", icon: <PhotoshopMnemonicIcon className="files-menu-mnemonic-icon" /> };
const RECENT_OPEN_IN_EXPRESS: RecentMenuAction = { id: "open-express", label: "Open in Adobe Express", icon: <ExpressMnemonicIcon className="files-menu-mnemonic-icon" /> };
const RECENT_SHARE: RecentMenuAction = { id: "share", label: "Share", icon: <ShareIcon /> };
const RECENT_RENAME: RecentMenuAction = { id: "rename", label: "Rename", icon: <RenameIcon /> };
const RECENT_DELETE: RecentMenuAction = { id: "delete", label: "Delete", icon: <DeleteIcon /> };
const RECENT_DELETE_PERMANENTLY: RecentMenuAction = { id: "delete", label: "Delete permanently", icon: <DeleteIcon /> };
const RECENT_DOWNLOAD: RecentMenuAction = { id: "download", label: "Download", icon: <DownloadIcon /> };

/** "More actions" menu items for each Recent files thumbnail, keyed by file kind — reuses the
    exact same icons as the equivalent actions on the Files tab's card ActionMenu. */
const RECENT_MENU_BY_KIND: Record<FileKind, RecentMenuAction[]> = {
  image: [RECENT_OPEN, RECENT_OPEN_IN_BOARDS, RECENT_RENAME, RECENT_DELETE, RECENT_DOWNLOAD],
  video: [RECENT_OPEN, RECENT_OPEN_IN_BOARDS, RECENT_RENAME, RECENT_DELETE, RECENT_DOWNLOAD],
  express: [RECENT_OPEN, RECENT_SHARE, RECENT_RENAME, RECENT_DELETE],
  pdf: [RECENT_OPEN, RECENT_SHARE, RECENT_RENAME, RECENT_DELETE, RECENT_DOWNLOAD],
  "firefly-image": [
    RECENT_OPEN,
    RECENT_OPEN_IN_BOARDS,
    RECENT_OPEN_IN_PHOTOSHOP,
    RECENT_OPEN_IN_EXPRESS,
    RECENT_RENAME,
    RECENT_DELETE_PERMANENTLY,
    RECENT_DOWNLOAD,
  ],
  "firefly-board": [RECENT_OPEN, RECENT_SHARE, RECENT_RENAME, RECENT_DELETE],
  photoshop: [RECENT_OPEN, RECENT_OPEN_IN_BOARDS, RECENT_SHARE, RECENT_RENAME, RECENT_DELETE, RECENT_DOWNLOAD],
  illustrator: [RECENT_OPEN, RECENT_OPEN_IN_BOARDS, RECENT_SHARE, RECENT_RENAME, RECENT_DELETE, RECENT_DOWNLOAD],
};

type HeroActionGroup = { inline: RecentMenuAction[]; more: RecentMenuAction[] };

/** Hero preview's CRUD action order, keyed by file kind: the first N actions render as inline
    icon+label rows next to the primary "Open" button, and the rest collapse into a "More" menu
    (omitted entirely when there's nothing to overflow). Reuses the same action/icon objects as
    the Recent files thumbnail menu above. */
const HERO_ACTIONS_BY_KIND: Record<FileKind, HeroActionGroup> = {
  image: { inline: [RECENT_RENAME, RECENT_DELETE], more: [RECENT_DOWNLOAD, RECENT_OPEN_IN_BOARDS] },
  video: { inline: [RECENT_RENAME, RECENT_DELETE], more: [RECENT_DOWNLOAD, RECENT_OPEN_IN_BOARDS] },
  express: { inline: [RECENT_SHARE, RECENT_RENAME, RECENT_DELETE], more: [] },
  pdf: { inline: [RECENT_SHARE, RECENT_RENAME], more: [RECENT_DELETE, RECENT_DOWNLOAD] },
  "firefly-image": {
    inline: [RECENT_RENAME, RECENT_DELETE_PERMANENTLY],
    more: [RECENT_DOWNLOAD, RECENT_OPEN_IN_PHOTOSHOP, RECENT_OPEN_IN_EXPRESS, RECENT_OPEN_IN_BOARDS],
  },
  "firefly-board": { inline: [RECENT_SHARE, RECENT_RENAME, RECENT_DELETE], more: [] },
  photoshop: { inline: [RECENT_SHARE, RECENT_RENAME], more: [RECENT_DELETE, RECENT_DOWNLOAD, RECENT_OPEN_IN_BOARDS] },
  illustrator: { inline: [RECENT_SHARE, RECENT_RENAME], more: [RECENT_DELETE, RECENT_DOWNLOAD, RECENT_OPEN_IN_BOARDS] },
};

const DEFAULT_ACTION_CARDS: ActionCard[] = [
  { image: cardRemoveBg, highlight: "Remove the background", after: " of this image", brand: "ai" },
  { image: cardResize, highlight: "Resize and crop images", after: " for every platform", brand: "ai" },
  { image: cardAdjustments, highlight: "Apply photo adjustments", after: " across multiple images", brand: "ai" },
  { image: cardVideo, before: "Turn this ", highlight: "image into video", after: " to bring it to life", brand: "firefly" },
  { image: cardReference, before: "Use this ", highlight: "as a reference image", after: " to create something new", brand: "firefly" },
  { image: cardMoodboard, highlight: "Start a moodboard", after: " with this image", brand: "firefly" },
];

const ACTION_CARDS_BY_KIND: Partial<Record<FileKind, ActionCard[]>> = {
  image: [
    { image: cardRemoveBg, highlight: "Remove the background", after: " of this image", brand: "ai" },
    { image: cardResize, highlight: "Crop and resize", after: " this image", brand: "ai" },
    { image: cardAdjustments, before: "Add an ", highlight: "image effect", brand: "ai" },
    { image: cardVideo, highlight: "Convert this image to video", after: " to bring motion to your visuals", brand: "firefly" },
    { image: cardReference, highlight: "Generate an image with a composition reference", after: " to match layout and framing", brand: "firefly" },
    { image: cardMoodboard, highlight: "Remove objects", after: " you don't want to see", brand: "photoshop" },
  ],
  express: [
    { image: expressDesignElements, highlight: "Add shapes, backgrounds, and design elements", after: " to your project", brand: "express" },
    { image: expressAddMedia, highlight: "Add photos, videos, or music", after: " to your project", brand: "express" },
    { image: expressVideo, highlight: "Generate a video clip", after: " from a descriptive text prompt", brand: "express" },
    { image: expressGenerateImage, highlight: "Generate a new image", after: " to add to this project", brand: "express" },
    { image: expressTextEffect, before: "Make your message pop with a ", highlight: "text effect", brand: "express" },
    { image: expressOrganizeData, highlight: "Organize data and images", after: " in this project with grids, charts, and tables", brand: "express" },
  ],
  pdf: [
    { image: pdfChat, before: "Save time by asking AI Assistant to ", highlight: "chat with your document", brand: "acrobat" },
    { image: pdfSummarize, highlight: "Summarize key points", after: " in your document with AI Assistant", brand: "acrobat" },
    { image: pdfEdit, highlight: "Edit the text or images", after: " in this PDF", brand: "acrobat" },
    { image: pdfSignatures, highlight: "Request signatures", after: " on a contract or agreement", brand: "acrobat" },
    { image: pdfConvert, highlight: "Convert PDF to Microsoft Office", after: " or another file format", brand: "acrobat" },
    { image: pdfCombine, highlight: "Combine multiple files", after: " into a single document", brand: "acrobat" },
  ],
  video: [
    { image: videoResize, highlight: "Resize", after: " this video", brand: "ai" },
    { image: videoMoodboard, highlight: "Create a moodboard", after: " for this file", brand: "ai" },
    { image: videoSummarize, highlight: "Summarize", after: " the spoken content of this file", brand: "ai" },
  ],
  "firefly-image": [
    { image: cardAdjustments, before: "Add an ", highlight: "image effect", brand: "ai" },
  ],
  "firefly-board": [
    { image: cardAdjustments, before: "Add an ", highlight: "image effect", brand: "ai" },
  ],
  photoshop: [
    { image: cardVideo, highlight: "Convert this image to video", after: " to bring motion to your visuals", brand: "firefly" },
    { image: cardReference, highlight: "Generate an image with a composition reference", after: " to match layout and framing", brand: "firefly" },
    { image: cardMoodboard, highlight: "Remove objects", after: " you don't want to see", brand: "photoshop" },
    { image: psGenerateObjects, before: "Generate ", highlight: "new objects or backgrounds", after: " in this image", brand: "photoshop" },
    { image: psImageLayer, before: "Generate ", highlight: "a new image layer", after: " from a description", brand: "photoshop" },
    { image: psAdjustments, before: "Make ", highlight: "quick adjustments", after: " and add effects", brand: "photoshop" },
  ],
  illustrator: [
    { image: videoMoodboard, highlight: "Create a moodboard", after: " for this file", brand: "ai" },
    { image: aiExport, highlight: "Export", after: " this Illustrator file", brand: "ai" },
    { image: aiExpressLink, before: "Add your AI designs to a ", highlight: "new Express file", after: " as a linked image", brand: "express" },
  ],
};

export function HomePage() {
  const { setHomeNavId, setAiAssistantRequest, setPlaceholderApp } = useSelectedApp();
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const selectedFile = FILES.find((file) => file.id === selectedFileId) ?? null;
  const actionCards = selectedFile ? (ACTION_CARDS_BY_KIND[selectedFile.kind] ?? DEFAULT_ACTION_CARDS) : [];

  const handleActionCardClick = (card: ActionCard) => {
    if (!selectedFile) {
      return;
    }
    if (card.brand === "ai") {
      setAiAssistantRequest({ thumbnail: selectedFile.thumbnail, prompt: cardText(card) });
      setHomeNavId("ai-assistant");
    } else {
      setPlaceholderApp(PLACEHOLDER_APP_NAME[card.brand] ?? card.brand);
    }
  };

  return (
    <>
      <div className="app-frame-content home-content">
        {selectedFile ? (
          <main className="home-main">
            <div className="home-hero">
              <div className="home-hero-bg">
                <img src={selectedFile.thumbnail} alt="" className="home-hero-bg-image" />
              </div>

              <ActionButton
                isQuiet
                aria-label="Close"
                UNSAFE_className="home-hero-close"
                onPress={() => setSelectedFileId(null)}
              >
                <CloseIcon />
              </ActionButton>

              <div className="home-hero-content">
                <div className="home-hero-top">
                  <div className="home-hero-spacer" />

                  <div className="home-hero-thumb">
                    <img src={selectedFile.thumbnail} alt="" className="home-hero-thumb-image" />
                  </div>

                  <div className="home-hero-actions">
                    <Button variant="accent" UNSAFE_className="home-hero-open-button">Open</Button>
                    <div className="home-hero-actions-list">
                      {HERO_ACTIONS_BY_KIND[selectedFile.kind].inline.map((action) => (
                        <button
                          key={action.id}
                          type="button"
                          className="home-hero-action-row"
                          onClick={action.id === "delete" ? () => setSelectedFileId(null) : undefined}
                        >
                          {action.icon}
                          <span>{action.label}</span>
                        </button>
                      ))}
                      {HERO_ACTIONS_BY_KIND[selectedFile.kind].more.length > 0 && (
                        <MenuTrigger>
                          <ActionButton isQuiet UNSAFE_className="home-hero-action-row home-hero-action-trigger">
                            <MoreIcon />
                            <Text slot="label">More</Text>
                          </ActionButton>
                          <Menu aria-label="More actions" onAction={(key) => key === "delete" && setSelectedFileId(null)}>
                            <MenuSection aria-label="More actions">
                              {HERO_ACTIONS_BY_KIND[selectedFile.kind].more.map((action) => (
                                <MenuItem key={action.id} id={action.id} textValue={action.label}>
                                  {action.icon}
                                  <Text slot="label">{action.label}</Text>
                                </MenuItem>
                              ))}
                            </MenuSection>
                          </Menu>
                        </MenuTrigger>
                      )}
                    </div>
                  </div>
                </div>

                <div className="home-hero-bottom">
                  <p className="home-hero-name">{selectedFile.name}</p>
                  <p className="home-hero-format">{KIND_FORMAT[selectedFile.kind]}</p>
                </div>
              </div>
            </div>

            <section className="home-quickstart">
              <div className="home-action-cards">
                {actionCards.map((card, i) => {
                  const brandInfo = BRAND_INFO[card.brand];
                  return (
                    <button
                      type="button"
                      className={`home-action-card home-action-card--${card.brand}`}
                      key={i}
                      onClick={() => handleActionCardClick(card)}
                    >
                      <img src={card.image} alt="" className="home-action-card-image" />
                      <div className="home-action-card-body">
                        <p className="home-action-card-title">
                          {card.before}
                          <span className="home-action-card-highlight">{card.highlight}</span>
                          {card.after}
                        </p>
                        <div className="home-action-card-footer">
                          {brandInfo.icon ? (
                            <img src={brandInfo.icon} alt="" className="home-action-card-footer-icon" />
                          ) : (
                            <MagicWandIcon />
                          )}
                          <span>{brandInfo.label}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </main>
        ) : (
          <HomeDashboard />
        )}
      </div>

      <div className="app-frame-right-panel home-right-panel">
        <header className="home-right-panel-header">
          <span className="home-right-panel-title">Recent files</span>
          <div className="home-right-panel-actions">
            <ActionButton isQuiet aria-label="Create new"><AddIcon /></ActionButton>
            <ActionButton isQuiet aria-label="View as"><ViewListIcon /></ActionButton>
            <ActionButton isQuiet aria-label="Go to files" onPress={() => setHomeNavId("files")}>
              <FolderIcon />
            </ActionButton>
          </div>
        </header>

        <div className="home-recent-grid">
          {FILES.map((file) => (
            <div key={file.id} className="home-recent-item" data-selected={file.id === selectedFileId}>
              <div className="home-recent-thumb-wrap">
                <button
                  type="button"
                  className="home-recent-thumb-button"
                  aria-label={`Open ${file.name}`}
                  onClick={() => setSelectedFileId(file.id)}
                >
                  <span className="home-recent-thumb">
                    <Image src={file.thumbnail} alt="" UNSAFE_className="home-recent-thumb-image" />
                    <FileBadge kind={file.kind} />
                  </span>
                </button>

                <div className="home-recent-menu" onClick={(e) => e.stopPropagation()}>
                  <ActionMenu aria-label={`More actions for ${file.name}`} align="end">
                    <MenuSection aria-label="Actions">
                      {RECENT_MENU_BY_KIND[file.kind].map((action) => (
                        <MenuItem key={action.id} id={action.id} textValue={action.label}>
                          {action.icon}
                          <Text slot="label">{action.label}</Text>
                        </MenuItem>
                      ))}
                    </MenuSection>
                  </ActionMenu>
                </div>
              </div>

              <span className="home-recent-name">{file.name}</span>
              <span className="home-recent-format">{KIND_FORMAT[file.kind]}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
