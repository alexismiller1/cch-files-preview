import { cloneElement, useEffect, useState, type MouseEvent, type ReactNode } from "react";
import {
  ActionButton,
  ActionMenu,
  Avatar,
  Button,
  Divider,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  Text,
} from "@react-spectrum/s2";
import OpenInIcon from "@react-spectrum/s2/icons/OpenIn";
import ChevronDownIcon from "@react-spectrum/s2/icons/ChevronDown";
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
import ToolsIcon from "@react-spectrum/s2/icons/Tools";
import ZoomInIcon from "@react-spectrum/s2/icons/ZoomIn";
import ZoomOutIcon from "@react-spectrum/s2/icons/ZoomOut";
import PlayIcon from "@react-spectrum/s2/icons/Play";
import PauseIcon from "@react-spectrum/s2/icons/Pause";
import VolumeTwoIcon from "@react-spectrum/s2/icons/VolumeTwo";
import DownloadIcon from "@react-spectrum/s2/icons/Download";
import MaximizeIcon from "@react-spectrum/s2/icons/Maximize";
import { MnemonicIcon, type MnemonicKind } from "../MnemonicIcons";
import {
  CONSOLIDATED_OPEN_CONFIG,
  CONTEXT_ACTIONS,
  EDIT_APP_NAME,
  EXTRA_OPEN_ACTIONS,
  KINDS_WITHOUT_GENERIC_OPEN,
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

type RailTab = "details" | "actions" | "ai" | "comments";

/** Kinds that get the "Describe a change to this file" prompt bar at the top of the Actions tab. */
const PROMPT_BAR_KINDS: FileKind[] = ["image", "video", "firefly-image"];

/** One rail icon button, shared by the expanded rail and the collapsed rail card. */
function RailTabButton({
  tab,
  activeTab,
  onSelect,
  label,
  children,
}: {
  tab: RailTab;
  activeTab: RailTab;
  onSelect: (tab: RailTab) => void;
  label: string;
  children: ReactNode;
}) {
  const isActive = activeTab === tab;
  return (
    <ActionButton
      size="M"
      isQuiet={!isActive}
      staticColor={isActive ? "black" : undefined}
      UNSAFE_className={isActive ? "file-preview-modal-rail-btn--active" : undefined}
      aria-label={label}
      onPress={() => onSelect(tab)}
    >
      {children}
    </ActionButton>
  );
}

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
  /** Option 4 (Action tab): adds a dedicated "Actions" rail tab (default-selected) holding the quick
   * actions, which are removed from the Details tab. */
  showActionsTab?: boolean;
  /** Option 5 (Consolidated open menu): replaces the flat list of open-destination buttons in the
   * header with a single "Open"/"Open in" split button (a dropdown of destinations, default action
   * on press) per CONSOLIDATED_OPEN_CONFIG, alongside a standalone action like "Edit in Firefly" when
   * that kind has one. Implies showActionsTab (reuses Option 4's fullscreen + Actions tab base). */
  consolidatedOpenMenu?: boolean;
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

/**
 * Option 5's consolidated "Open in ___" control. The button always shows the default (first) item's
 * own label — e.g. "Open in Photoshop web" — never a generic "Open"/"Open in". A single item renders
 * as a plain button (no dropdown); multiple items render as a split button: pressing the button body
 * fires the default item, while the attached chevron opens a menu listing the *other* items — the
 * default isn't repeated there since the button itself already reads as that action.
 */
function OpenMenuButton({
  items,
  onOpenApp,
}: {
  items: { label: string; appName: string }[];
  onOpenApp: (appName: string) => void;
}) {
  const [defaultItem, ...otherItems] = items;
  const label = defaultItem.label;

  if (otherItems.length === 0) {
    return (
      <Button variant="secondary" size="M" onPress={() => onOpenApp(defaultItem.appName)}>
        <OpenInIcon />
        <Text>{label}</Text>
      </Button>
    );
  }

  return (
    <div className="file-preview-modal-split-open">
      <Button
        variant="secondary"
        size="M"
        UNSAFE_className="file-preview-modal-split-open-main"
        onPress={() => onOpenApp(defaultItem.appName)}
      >
        <OpenInIcon />
        <Text>{label}</Text>
      </Button>
      <MenuTrigger>
        <Button
          variant="secondary"
          size="M"
          aria-label="More open options"
          UNSAFE_className="file-preview-modal-split-open-chevron"
        >
          <ChevronDownIcon />
        </Button>
        <Menu
          aria-label="Open in"
          onAction={(key) => {
            const item = otherItems.find((i) => i.label === key);
            if (item) onOpenApp(item.appName);
          }}
        >
          {otherItems.map((item) => (
            <MenuItem key={item.label} id={item.label} textValue={item.label}>
              <OpenInIcon />
              <Text slot="label">{item.label}</Text>
            </MenuItem>
          ))}
        </Menu>
      </MenuTrigger>
    </div>
  );
}

/** File preview panel shared by all 5 preview options — see the `size`/`showActionsTab`/`consolidatedOpenMenu` props. */
export function FilePreviewModal({
  size,
  showActionsTab = false,
  consolidatedOpenMenu = false,
  file,
  onClose,
  onNavigate,
  onOpenApp,
  onQuickAction,
}: FilePreviewModalProps) {
  const actions = CONTEXT_ACTIONS[file.kind];
  const isFireflyImage = file.kind === "firefly-image";
  const isVideo = file.kind === "video";
  const showZoom = file.kind === "image" || file.kind === "firefly-image";
  const showResolution = RASTER_KINDS.includes(file.kind);
  const extraOpenActions = EXTRA_OPEN_ACTIONS[file.kind] ?? [];
  const consolidatedOpenConfig = CONSOLIDATED_OPEN_CONFIG[file.kind];
  const showPromptBar = showActionsTab && PROMPT_BAR_KINDS.includes(file.kind);
  const hasQuickActions = !!actions && actions.length > 0;
  /** The Actions tab only exists when there's something to put in it — matches the "no tab" behavior on boards, which have neither a prompt bar nor quick actions. */
  const actionsTabAvailable = showActionsTab && (hasQuickActions || showPromptBar);
  /** Acrobat (PDF) files don't get the AI Assistant tab. */
  const showAiTab = file.kind !== "pdf";

  const [detailsCollapsed, setDetailsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<RailTab>(() => {
    if (actionsTabAvailable) return "actions";
    // If Option 4 is active but this file has no Actions tab (e.g. boards), land on AI Assistant instead of Details.
    if (showActionsTab && showAiTab) return "ai";
    return "details";
  });
  const [draftPrompt, setDraftPrompt] = useState("");
  const [aiPrompt, setAiPrompt] = useState<string | null>(null);

  // The modal doesn't remount when navigating prev/next to a different file, so the active tab has to
  // be reset to that file's own recommended default (Actions when available, else AI Assistant/Details)
  // whenever the previewed file changes — otherwise e.g. leaving a board (no Actions tab, so it falls
  // back to AI Assistant) and landing on a Photoshop file would incorrectly stay on AI Assistant instead
  // of that file's Create tab.
  useEffect(() => {
    setActiveTab(actionsTabAvailable ? "actions" : showActionsTab && showAiTab ? "ai" : "details");
  }, [file.id, actionsTabAvailable, showActionsTab, showAiTab]);

  const submitPrompt = () => {
    const trimmed = draftPrompt.trim();
    if (!trimmed) return;
    setAiPrompt(trimmed);
    setActiveTab("ai");
    setDraftPrompt("");
  };

  const quickActionButtons =
    hasQuickActions && actions
      ? actions.map((action) => (
          <button
            key={action.label}
            type="button"
            className="file-preview-modal-quick-action"
            onClick={() => onQuickAction(action.icon)}
          >
            <MnemonicIcon kind={action.icon} className="file-preview-modal-quick-action-icon" />
            <span>{action.label}</span>
          </button>
        ))
      : null;

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
          {consolidatedOpenMenu ? (
            <OpenMenuButton items={consolidatedOpenConfig} onOpenApp={onOpenApp} />
          ) : (
            <>
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
              {!KINDS_WITHOUT_GENERIC_OPEN.includes(file.kind) && (
                <Button variant="secondary" size="M" onPress={() => onOpenApp(EDIT_APP_NAME[file.kind])}>
                  <OpenInIcon />
                  <Text>Open</Text>
                </Button>
              )}
            </>
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
                {actionsTabAvailable && (
                  <RailTabButton
                    tab="actions"
                    activeTab={activeTab}
                    label="Actions"
                    onSelect={(tab) => {
                      setActiveTab(tab);
                      setDetailsCollapsed(false);
                    }}
                  >
                    <ToolsIcon />
                  </RailTabButton>
                )}
                {showAiTab && (
                  <RailTabButton
                    tab="ai"
                    activeTab={activeTab}
                    label="AI Assistant"
                    onSelect={(tab) => {
                      setActiveTab(tab);
                      setDetailsCollapsed(false);
                    }}
                  >
                    <MagicWandIcon />
                  </RailTabButton>
                )}
                <RailTabButton
                  tab="details"
                  activeTab={activeTab}
                  label="Details"
                  onSelect={(tab) => {
                    setActiveTab(tab);
                    setDetailsCollapsed(false);
                  }}
                >
                  <InfoCircleIcon />
                </RailTabButton>
                <RailTabButton
                  tab="comments"
                  activeTab={activeTab}
                  label="Comments"
                  onSelect={(tab) => {
                    setActiveTab(tab);
                    setDetailsCollapsed(false);
                  }}
                >
                  <ChatIcon />
                </RailTabButton>
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

                    {!actionsTabAvailable && quickActionButtons && (
                      <>
                        <p className="file-preview-modal-section-heading">Try this next</p>
                        <div className="file-preview-modal-quick-actions">{quickActionButtons}</div>
                      </>
                    )}
                  </>
                )}

                {activeTab === "actions" && actionsTabAvailable && (
                  <div className="file-preview-modal-actions-panel">
                    <p className="file-preview-modal-section-heading">Edit your file</p>
                    <div className="file-preview-modal-quick-actions">
                      {showPromptBar && (
                        <div className="file-preview-modal-create-prompt-box">
                          <MagicWandIcon />
                          <input
                            type="text"
                            className="file-preview-modal-prompt-field"
                            placeholder="Describe a change to this file"
                            value={draftPrompt}
                            onChange={(e) => setDraftPrompt(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                submitPrompt();
                              }
                            }}
                          />
                          <ActionButton isQuiet size="S" aria-label="Send" onPress={submitPrompt}>
                            <SendIcon />
                          </ActionButton>
                        </div>
                      )}
                      {quickActionButtons}
                    </div>
                  </div>
                )}

                {activeTab === "ai" && showAiTab && (
                  <div className="file-preview-modal-ai-panel">
                    {aiPrompt ? (
                      <div className="file-preview-modal-ai-conversation">
                        <div className="file-preview-modal-ai-user-bubble">{aiPrompt}</div>
                        <div className="file-preview-modal-ai-thinking">
                          <span className="file-preview-modal-ai-thinking-dots">
                            <span />
                            <span />
                            <span />
                          </span>
                          Generating response
                        </div>
                      </div>
                    ) : (
                      <p className="file-preview-modal-section-heading">Ask AI Assistant</p>
                    )}
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
                  {actionsTabAvailable && (
                    <RailTabButton tab="actions" activeTab={activeTab} label="Actions" onSelect={setActiveTab}>
                      <ToolsIcon />
                    </RailTabButton>
                  )}
                  {showAiTab && (
                    <RailTabButton tab="ai" activeTab={activeTab} label="AI Assistant" onSelect={setActiveTab}>
                      <MagicWandIcon />
                    </RailTabButton>
                  )}
                  <RailTabButton tab="details" activeTab={activeTab} label="Details" onSelect={setActiveTab}>
                    <InfoCircleIcon />
                  </RailTabButton>
                  <RailTabButton tab="comments" activeTab={activeTab} label="Comments" onSelect={setActiveTab}>
                    <ChatIcon />
                  </RailTabButton>
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
