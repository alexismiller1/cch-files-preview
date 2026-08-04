import { cloneElement, useState, type MouseEvent } from "react";
import { ActionButton, ActionMenu, Avatar, Button, Divider, MenuItem, MenuSection, Text } from "@react-spectrum/s2";
import OpenInIcon from "@react-spectrum/s2/icons/OpenIn";
import SendIcon from "@react-spectrum/s2/icons/Send";
import ShareIcon from "@react-spectrum/s2/icons/Share";
import CopyIcon from "@react-spectrum/s2/icons/Copy";
import RenameIcon from "@react-spectrum/s2/icons/Rename";
import DuplicateIcon from "@react-spectrum/s2/icons/Duplicate";
import FolderMoveToIcon from "@react-spectrum/s2/icons/FolderMoveTo";
import DeleteIcon from "@react-spectrum/s2/icons/Delete";
import ChevronLeftIcon from "@react-spectrum/s2/icons/ChevronLeft";
import ChevronRightIcon from "@react-spectrum/s2/icons/ChevronRight";
import ChevronDoubleRightIcon from "@react-spectrum/s2/icons/ChevronDoubleRight";
import CloseIcon from "@react-spectrum/s2/icons/Close";
import InfoCircleIcon from "@react-spectrum/s2/icons/InfoCircle";
import ChatIcon from "@react-spectrum/s2/icons/Chat";
import MagicWandIcon from "@react-spectrum/s2/icons/MagicWand";
import ZoomInIcon from "@react-spectrum/s2/icons/ZoomIn";
import ZoomOutIcon from "@react-spectrum/s2/icons/ZoomOut";
import PlayIcon from "@react-spectrum/s2/icons/Play";
import PauseIcon from "@react-spectrum/s2/icons/Pause";
import VolumeTwoIcon from "@react-spectrum/s2/icons/VolumeTwo";
import DownloadIcon from "@react-spectrum/s2/icons/Download";
import MaximizeIcon from "@react-spectrum/s2/icons/Maximize";
import { MnemonicIcon, type MnemonicKind } from "../MnemonicIcons";
import {
  CONTEXT_ACTIONS,
  EDIT_APP_NAME,
  EXTRA_OPEN_ACTIONS,
  FileKindIcon,
  KIND_FORMAT,
  type FileEntry,
  type FileKind,
} from "../../data/filesData";
import pencilAvatar from "../../assets/avatars/pencil_avatar_128px.png";
import layersAvatar from "../../assets/avatars/layers_avatar_128px.png";
import scissorsAvatar from "../../assets/avatars/scissors_avatar_128px.png";
import "./FilePreviewModal.css";

const PROMPT_TEXT =
  "Japanese architecture with trees placeholder text goes here spanning multiple lines for longer prompts placeholder text placeholder text goes here spanning multiple lines for longer prompts placeholder text here...";

/** Kinds with a real pixel resolution — everything else (documents/boards) skips that metadata row. */
const RASTER_KINDS: FileKind[] = ["image", "video", "firefly-image", "photoshop"];

type RailTab = "details" | "ai" | "comments";

const COMMENTS = [
  {
    id: "1",
    name: "Jordan Lee",
    avatar: pencilAvatar,
    time: "2 hours ago",
    text: "Love the lighting here — can we get a version with warmer tones?",
  },
  {
    id: "2",
    name: "Priya Nair",
    avatar: layersAvatar,
    time: "Yesterday",
    text: "Approved for the homepage banner.",
  },
  {
    id: "3",
    name: "Sam Torres",
    avatar: scissorsAvatar,
    time: "2 days ago",
    text: "Can you crop this tighter on the left side?",
  },
];

export type FilePreviewModalProps = {
  /**
   * "fullscreen" fills the main content area (nav/sidebar stay visible); "small" is a centered dialog
   * with a scrim, covering the whole Files page; "split" docks to the right as a normal half-width
   * column, pushing the grid and collapsing the files sidebar to make room (no overlay/scrim).
   */
  size: "fullscreen" | "small" | "split";
  file: FileEntry;
  onClose: () => void;
  onNavigate: (direction: "prev" | "next") => void;
  onOpenApp: (appName: string) => void;
  onQuickAction: (icon: MnemonicKind) => void;
};

function ZoomControl() {
  const [zoom, setZoom] = useState(80);
  return (
    <div className="file-preview-zoom">
      <ActionButton
        isQuiet
        size="S"
        aria-label="Zoom out"
        onPress={() => setZoom((z) => Math.max(25, z - 10))}
      >
        <ZoomOutIcon />
      </ActionButton>
      <span className="file-preview-zoom-value">{zoom}%</span>
      <ActionButton
        isQuiet
        size="S"
        aria-label="Zoom in"
        onPress={() => setZoom((z) => Math.min(200, z + 10))}
      >
        <ZoomInIcon />
      </ActionButton>
    </div>
  );
}

function VideoPreview({ file }: { file: FileEntry }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="file-preview-video">
      <img src={file.thumbnail} alt="" className="file-preview-video-poster" />
      <div className="file-preview-video-scrubber">
        <div className="file-preview-video-scrubber-played" style={{ width: "20%" }} />
      </div>
      <div className="file-preview-video-controls">
        <ActionButton
          isQuiet
          size="S"
          staticColor="white"
          aria-label={playing ? "Pause" : "Play"}
          onPress={() => setPlaying((p) => !p)}
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
        </ActionButton>
        <ActionButton isQuiet size="S" staticColor="white" aria-label="Volume">
          <VolumeTwoIcon />
        </ActionButton>
        <span className="file-preview-video-time">00:01 / 00:05</span>
        <div className="file-preview-video-controls-spacer" />
        <ActionButton isQuiet size="S" staticColor="white" aria-label="Download">
          <DownloadIcon />
        </ActionButton>
        <ActionButton isQuiet size="S" staticColor="white" aria-label="Full screen">
          <MaximizeIcon />
        </ActionButton>
      </div>
    </div>
  );
}

/** Full screen file preview overlay (Option 2), scoped to the Files page's main content area only — the left primary nav and files sidebar stay visible behind it. */
export function FilePreviewModal({ size, file, onClose, onNavigate, onOpenApp, onQuickAction }: FilePreviewModalProps) {
  const [detailsCollapsed, setDetailsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<RailTab>("details");
  const actions = CONTEXT_ACTIONS[file.kind];
  const isFireflyImage = file.kind === "firefly-image";
  const isVideo = file.kind === "video";
  const showZoom = file.kind === "image" || file.kind === "firefly-image";
  const showResolution = RASTER_KINDS.includes(file.kind);
  const extraOpenActions = EXTRA_OPEN_ACTIONS[file.kind] ?? [];

  const modal = (
    <div className={`file-preview-modal file-preview-modal--${size}`} role="dialog" aria-modal="true" aria-label={file.name}>
      <header className="file-preview-modal-header">
        <div className="file-preview-modal-header-left">
          <span className="file-preview-modal-app-icon">
            <FileKindIcon kind={file.kind} />
          </span>
          <div className="file-preview-modal-title-wrap">
            <p className="file-preview-modal-title">{file.name}</p>
          </div>
        </div>
        <div className="file-preview-modal-header-right">
          {extraOpenActions.map((action) => (
            <Button
              key={action.label}
              variant="secondary"
              size="M"
              onPress={() => onOpenApp(action.appName)}
            >
              <OpenInIcon />
              <Text>{action.label}</Text>
            </Button>
          ))}
          {extraOpenActions.length === 0 && (
            <Button variant="secondary" size="M" onPress={() => onOpenApp(EDIT_APP_NAME[file.kind])}>
              <OpenInIcon />
              <Text>Open</Text>
            </Button>
          )}
          <ActionMenu isQuiet size="L" aria-label="More actions">
            <MenuSection aria-label="File actions">
              <MenuItem textValue="Share">
                <ShareIcon />
                <Text slot="label">Share</Text>
              </MenuItem>
              <MenuItem textValue="Copy link">
                <CopyIcon />
                <Text slot="label">Copy link</Text>
              </MenuItem>
              <MenuItem textValue="Rename">
                <RenameIcon />
                <Text slot="label">Rename</Text>
              </MenuItem>
              <MenuItem textValue="Duplicate">
                <DuplicateIcon />
                <Text slot="label">Duplicate</Text>
              </MenuItem>
              <MenuItem textValue="Move">
                <FolderMoveToIcon />
                <Text slot="label">Move</Text>
              </MenuItem>
              <MenuItem textValue="Download">
                <DownloadIcon />
                <Text slot="label">Download</Text>
              </MenuItem>
            </MenuSection>
            <MenuSection aria-label="Delete action">
              <MenuItem textValue="Delete">
                <DeleteIcon />
                <Text slot="label">Delete</Text>
              </MenuItem>
            </MenuSection>
          </ActionMenu>
          <div className="file-preview-modal-nav">
            <ActionButton isQuiet size="L" aria-label="Previous file" onPress={() => onNavigate("prev")}>
              <ChevronLeftIcon />
            </ActionButton>
            <ActionButton isQuiet size="L" aria-label="Next file" onPress={() => onNavigate("next")}>
              <ChevronRightIcon />
            </ActionButton>
          </div>
          <Divider orientation="vertical" size="M" />
          <ActionButton isQuiet size="L" aria-label="Close" onPress={onClose}>
            <CloseIcon />
          </ActionButton>
        </div>
      </header>

      <div className="file-preview-modal-body">
        <div className="file-preview-modal-preview">
          {isVideo ? (
            <VideoPreview file={file} />
          ) : (
            <img src={file.thumbnail} alt={file.name} className="file-preview-modal-image" />
          )}
          {showZoom && <ZoomControl />}
        </div>

        {detailsCollapsed ? (
          <div className="file-preview-modal-collapsed-rail-wrap">
            <div className="file-preview-modal-collapsed-rail-card">
              <Divider orientation="vertical" size="S" />
              <div className="file-preview-modal-rail-buttons">
                <ActionButton
                  isQuiet
                  size="M"
                  aria-label="Expand details panel"
                  onPress={() => setDetailsCollapsed(false)}
                >
                  <ChevronDoubleRightIcon />
                </ActionButton>
                <Divider size="S" />
                <ActionButton
                  size="M"
                  isQuiet={activeTab !== "details"}
                  staticColor={activeTab === "details" ? "black" : undefined}
                  UNSAFE_className={activeTab === "details" ? "file-preview-modal-rail-btn--active" : undefined}
                  aria-label="Details"
                  onPress={() => {
                    setActiveTab("details");
                    setDetailsCollapsed(false);
                  }}
                >
                  <InfoCircleIcon />
                </ActionButton>
                <ActionButton
                  size="M"
                  isQuiet={activeTab !== "ai"}
                  staticColor={activeTab === "ai" ? "black" : undefined}
                  UNSAFE_className={activeTab === "ai" ? "file-preview-modal-rail-btn--active" : undefined}
                  aria-label="AI Assistant"
                  onPress={() => {
                    setActiveTab("ai");
                    setDetailsCollapsed(false);
                  }}
                >
                  <MagicWandIcon />
                </ActionButton>
                <ActionButton
                  size="M"
                  isQuiet={activeTab !== "comments"}
                  staticColor={activeTab === "comments" ? "black" : undefined}
                  UNSAFE_className={activeTab === "comments" ? "file-preview-modal-rail-btn--active" : undefined}
                  aria-label="Comments"
                  onPress={() => {
                    setActiveTab("comments");
                    setDetailsCollapsed(false);
                  }}
                >
                  <ChatIcon />
                </ActionButton>
              </div>
            </div>
          </div>
        ) : (
          <div className="file-preview-modal-details-wrap">
            <div className="file-preview-modal-details-card">
              <div className="file-preview-modal-details-content">
                {activeTab === "details" && (
                  <>
                    <dl className="file-preview-modal-metadata">
                      <div className="file-preview-modal-metadata-row">
                        <dt>Type</dt>
                        <dd>{KIND_FORMAT[file.kind]}</dd>
                      </div>
                      <div className="file-preview-modal-metadata-row">
                        <dt>Size</dt>
                        <dd>{isVideo ? "128 MB" : "4.2 MB"}</dd>
                      </div>
                      <div className="file-preview-modal-metadata-row">
                        <dt>Last edited</dt>
                        <dd>Jul 28, 2026, 4:02 PM</dd>
                      </div>
                      {showResolution && (
                        <div className="file-preview-modal-metadata-row">
                          <dt>Resolution</dt>
                          <dd>{isVideo ? "1920 x 1080" : "2048 x 2048"}</dd>
                        </div>
                      )}
                      <div className="file-preview-modal-metadata-row">
                        <dt>Location</dt>
                        <dd>Your files</dd>
                      </div>
                    </dl>

                    {isFireflyImage && (
                      <div className="file-preview-modal-prompt">
                        <p className="file-preview-modal-section-heading">Prompt</p>
                        <p className="file-preview-modal-prompt-text">{PROMPT_TEXT}</p>
                      </div>
                    )}

                    {actions && actions.length > 0 && (
                      <>
                        <p className="file-preview-modal-section-heading">Try this next</p>
                        <div className="file-preview-modal-quick-actions">
                          {actions.map((action) => (
                            <button
                              key={action.label}
                              type="button"
                              className="file-preview-modal-quick-action"
                              onClick={() => onQuickAction(action.icon)}
                            >
                              <MnemonicIcon kind={action.icon} className="file-preview-modal-quick-action-icon" />
                              <span>{action.label}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                )}

                {activeTab === "ai" && (
                  <div className="file-preview-modal-ai-panel">
                    <p className="file-preview-modal-section-heading">Ask AI Assistant</p>
                    <div className="file-preview-modal-ai-prompt-box">
                      <div className="file-preview-modal-ai-prompt-input">Ask anything</div>
                      <ActionButton isQuiet size="S" aria-label="Send">
                        <SendIcon />
                      </ActionButton>
                    </div>
                    <div className="file-preview-modal-ai-disclaimer">
                      <InfoCircleIcon />
                      <span>Verify responses. Adobe Generative AI User Guidelines</span>
                    </div>
                  </div>
                )}

                {activeTab === "comments" && (
                  <div className="file-preview-modal-comments-panel">
                    <p className="file-preview-modal-section-heading">Comments</p>
                    <div className="file-preview-modal-comments-list">
                      {COMMENTS.map((comment) => (
                        <div key={comment.id} className="file-preview-modal-comment">
                          <Avatar src={comment.avatar} alt={comment.name} size={28} />
                          <div className="file-preview-modal-comment-body">
                            <div className="file-preview-modal-comment-meta">
                              <span className="file-preview-modal-comment-name">{comment.name}</span>
                              <span className="file-preview-modal-comment-time">{comment.time}</span>
                            </div>
                            <p className="file-preview-modal-comment-text">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="file-preview-modal-comment-input-row">
                      <div className="file-preview-modal-comment-input">Add a comment…</div>
                      <ActionButton isQuiet size="S" aria-label="Send comment">
                        <SendIcon />
                      </ActionButton>
                    </div>
                  </div>
                )}
              </div>

              <div className="file-preview-modal-rail">
                <Divider orientation="vertical" size="S" />
                <div className="file-preview-modal-rail-buttons">
                  <ActionButton
                    isQuiet
                    size="M"
                    aria-label="Collapse details panel"
                    onPress={() => setDetailsCollapsed(true)}
                  >
                    <ChevronDoubleRightIcon />
                  </ActionButton>
                  <Divider size="S" />
                  <ActionButton
                    size="M"
                    isQuiet={activeTab !== "details"}
                    staticColor={activeTab === "details" ? "black" : undefined}
                    UNSAFE_className={activeTab === "details" ? "file-preview-modal-rail-btn--active" : undefined}
                    aria-label="Details"
                    onPress={() => setActiveTab("details")}
                  >
                    <InfoCircleIcon />
                  </ActionButton>
                  <ActionButton
                    size="M"
                    isQuiet={activeTab !== "ai"}
                    staticColor={activeTab === "ai" ? "black" : undefined}
                    UNSAFE_className={activeTab === "ai" ? "file-preview-modal-rail-btn--active" : undefined}
                    aria-label="AI Assistant"
                    onPress={() => setActiveTab("ai")}
                  >
                    <MagicWandIcon />
                  </ActionButton>
                  <ActionButton
                    size="M"
                    isQuiet={activeTab !== "comments"}
                    staticColor={activeTab === "comments" ? "black" : undefined}
                    UNSAFE_className={activeTab === "comments" ? "file-preview-modal-rail-btn--active" : undefined}
                    aria-label="Comments"
                    onPress={() => setActiveTab("comments")}
                  >
                    <ChatIcon />
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (size === "small") {
    return (
      <div className="file-preview-modal-backdrop" onMouseDown={onClose}>
        {cloneElement(modal, { onMouseDown: (e: MouseEvent) => e.stopPropagation() })}
      </div>
    );
  }

  return modal;
}
