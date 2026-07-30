import { useState } from "react";
import {
  Breadcrumbs,
  Breadcrumb,
  Button,
  ActionButton,
  Picker,
  PickerItem,
  CardView,
  AssetCard,
  CardPreview,
  Image,
  Content,
  Text,
  ActionMenu,
  MenuItem,
  MenuSection,
  ActionBar,
  type Selection,
} from "@react-spectrum/s2";
import SortDownIcon from "@react-spectrum/s2/icons/SortDown";
import ListBulletedIcon from "@react-spectrum/s2/icons/ListBulleted";
import AppsAllIcon from "@react-spectrum/s2/icons/AppsAll";
import ImageIcon from "@react-spectrum/s2/icons/Image";
import FileTextIcon from "@react-spectrum/s2/icons/FileText";
import VideoIcon from "@react-spectrum/s2/icons/Video";
import OpenInIcon from "@react-spectrum/s2/icons/OpenIn";
import ArtboardIcon from "@react-spectrum/s2/icons/Artboard";
import ShareIcon from "@react-spectrum/s2/icons/Share";
import CopyIcon from "@react-spectrum/s2/icons/Copy";
import RenameIcon from "@react-spectrum/s2/icons/Rename";
import DuplicateIcon from "@react-spectrum/s2/icons/Duplicate";
import FolderMoveToIcon from "@react-spectrum/s2/icons/FolderMoveTo";
import DownloadIcon from "@react-spectrum/s2/icons/Download";
import DeleteIcon from "@react-spectrum/s2/icons/Delete";
import MoreIcon from "@react-spectrum/s2/icons/More";
import ChevronLeftIcon from "@react-spectrum/s2/icons/ChevronLeft";
import HistoryIcon from "@react-spectrum/s2/icons/History";
import MagicWandIcon from "@react-spectrum/s2/icons/MagicWand";
import CloseIcon from "@react-spectrum/s2/icons/Close";
import { FilesLeftNav } from "../components/FilesLeftNav";
import { FireflyMnemonicIcon, MnemonicIcon, type MnemonicKind } from "../components/MnemonicIcons";
import { FILES, FileBadge, KIND_FORMAT, type FileKind } from "../data/filesData";
import { useSelectedApp } from "../context/SelectedAppContext";
import "./FilesPage.css";

const FILTER_OPTIONS = [
  { id: "all", label: "All", Icon: AppsAllIcon },
  { id: "photos", label: "Photos", Icon: ImageIcon },
  { id: "documents", label: "Documents", Icon: FileTextIcon },
  { id: "videos", label: "Videos", Icon: VideoIcon },
];

/** Per-file-type contextual actions shown in the ActionMenu, each routed to the app that handles it. */
const CONTEXT_ACTIONS: Partial<Record<FileKind, { label: string; icon: MnemonicKind }[]>> = {
  image: [
    { label: "Convert this image to video", icon: "firefly" },
    { label: "Generate image with reference", icon: "firefly" },
    { label: "Remove objects", icon: "firefly" },
    { label: "Generate a new image layer", icon: "photoshop" },
    { label: "Make quick adjustments", icon: "photoshop" },
    { label: "Select objects", icon: "photoshop" },
  ],
  "firefly-image": [
    { label: "Convert this image to video", icon: "firefly" },
    { label: "Generate image with reference", icon: "firefly" },
    { label: "Remove objects", icon: "firefly" },
    { label: "Generate a new image layer", icon: "photoshop" },
    { label: "Make quick adjustments", icon: "photoshop" },
    { label: "Select objects", icon: "photoshop" },
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

/** File kinds that open in a placeholder "app" screen rather than the in-context file viewer. */
const KIND_APP_NAME: Partial<Record<FileKind, string>> = {
  pdf: "Acrobat",
  express: "Express",
  photoshop: "Photoshop",
  illustrator: "Illustrator",
  "firefly-image": "Firefly",
  "firefly-board": "Firefly Boards",
};

/** App a "Try these actions" quick action routes to, keyed by its mnemonic icon. */
const MNEMONIC_APP_NAME: Record<MnemonicKind, string> = {
  firefly: "Firefly",
  photoshop: "Photoshop",
  acrobat: "Acrobat",
  express: "Express",
};

type FileEntry = (typeof FILES)[number];

/** Shared breadcrumb-style back control used by both the file viewer and the app placeholder. */
function FileOpenBackNav({ onBack }: { onBack: () => void }) {
  return (
    <div className="file-open-header-left">
      <ActionButton isQuiet aria-label="Back to Your files" onPress={onBack}><ChevronLeftIcon /></ActionButton>
      <div className="file-open-crumb">
        <HistoryIcon />
        <span>Your files</span>
      </div>
    </div>
  );
}

/** Detailed in-context viewer for image/video files, matching the Figma "open file" frame. */
function FileOpenView({
  file,
  onBack,
  onQuickAction,
  onOpenInWeb,
}: {
  file: FileEntry;
  onBack: () => void;
  onQuickAction: (icon: MnemonicKind) => void;
  onOpenInWeb: () => void;
}) {
  const actions = CONTEXT_ACTIONS[file.kind];
  return (
    <div className="file-open-view">
      <header className="file-open-header">
        <FileOpenBackNav onBack={onBack} />
        <div className="file-open-header-center">
          <HistoryIcon />
          <span>{file.name}</span>
          <span className="file-open-format">{KIND_FORMAT[file.kind].toUpperCase()}</span>
        </div>
        <div className="file-open-header-right">
          <Button variant="secondary" size="M" onPress={() => onQuickAction("firefly")}>Edit in Firefly</Button>
          <Button variant="primary" size="M" onPress={onOpenInWeb}>Open in web</Button>
        </div>
      </header>
      <div className="file-open-body">
        <div className="file-open-viewer">
          <img src={file.thumbnail} alt={file.name} className="file-open-viewer-image" />
        </div>
        <aside className="file-open-details">
          <div className="file-open-details-title">
            <p className="file-open-details-name">{file.name}</p>
            <p className="file-open-details-format">{KIND_FORMAT[file.kind].toUpperCase()}</p>
          </div>
          <div className="file-open-details-section">
            <p className="file-open-details-heading">Details</p>
            <div className="file-open-details-row"><span>Created</span><span>7/20/2026, 9:14 AM</span></div>
            <div className="file-open-details-row"><span>Modified</span><span>7/28/2026, 4:02 PM</span></div>
            <div className="file-open-details-row"><span>Size</span><span>{file.kind === "video" ? "128 MB" : "4.2 MB"}</span></div>
          </div>
          {actions && (
            <div className="file-open-details-section">
              <p className="file-open-details-heading">Try these actions</p>
              <div className="file-open-quick-actions">
                {actions.map((action) => (
                  <button
                    key={action.label}
                    type="button"
                    className="file-open-quick-action"
                    onClick={() => onQuickAction(action.icon)}
                  >
                    <MnemonicIcon kind={action.icon} className="file-open-quick-action-icon" />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

/** Dismissible promo banner routing to the AI Assistant page with a prefilled prompt (no thumbnail, unlike the Home action cards). */
function AiAssistantBanner({ onTryIt, onDismiss }: { onTryIt: () => void; onDismiss: () => void }) {
  return (
    <div className="files-ai-banner">
      <div className="files-ai-banner-icon">
        <MagicWandIcon />
      </div>
      <p className="files-ai-banner-text">Edit a group of photos with the Adobe Assistant (Beta).</p>
      <Button variant="accent" size="M" UNSAFE_className="files-ai-banner-cta" onPress={onTryIt}>
        Try it
      </Button>
      <ActionButton isQuiet aria-label="Dismiss" UNSAFE_className="files-ai-banner-dismiss" onPress={onDismiss}>
        <CloseIcon />
      </ActionButton>
    </div>
  );
}

export function FilesPage() {
  const { setPlaceholderApp, goToAiAssistant } = useSelectedApp();
  const [leftNavSelectedId, setLeftNavSelectedId] = useState("files");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [openedFileId, setOpenedFileId] = useState<string | null>(null);
  const [showAiBanner, setShowAiBanner] = useState(true);

  const openedFile = FILES.find((file) => file.id === openedFileId) ?? null;

  const openFile = (id: string) => {
    const file = FILES.find((f) => f.id === id);
    if (file && (file.kind === "image" || file.kind === "video")) {
      setOpenedFileId(id);
    } else if (file) {
      setPlaceholderApp(KIND_APP_NAME[file.kind] ?? file.kind);
    }
  };

  return (
    <div className="app-frame-content files-page">
      <FilesLeftNav selectedId={leftNavSelectedId} onSelect={setLeftNavSelectedId} />

      <main className="files-main">
        {openedFile ? (
          <FileOpenView
            file={openedFile}
            onBack={() => setOpenedFileId(null)}
            onQuickAction={(icon) => setPlaceholderApp(MNEMONIC_APP_NAME[icon])}
            onOpenInWeb={() => setPlaceholderApp("Web")}
          />
        ) : (
          <>
        <header className="files-header">
          {showAiBanner && (
            <AiAssistantBanner
              onTryIt={() => goToAiAssistant({ prompt: "Edit a group of photos" })}
              onDismiss={() => setShowAiBanner(false)}
            />
          )}
          <div className="files-title-row">
            <Breadcrumbs size="L">
              <Breadcrumb>Your files</Breadcrumb>
            </Breadcrumbs>
            <Button variant="secondary" size="M">Add</Button>
          </div>

          <div className="files-filtering-row">
            <Picker aria-label="Filter files" defaultSelectedKey="all" items={FILTER_OPTIONS} size="M">
              {(item) => (
                <PickerItem textValue={item.label}>
                  <item.Icon />
                  <Text slot="label">{item.label}</Text>
                </PickerItem>
              )}
            </Picker>
            <div className="files-sort-grid-actions">
              <ActionButton isQuiet aria-label="Sort"><SortDownIcon /></ActionButton>
              <ActionButton isQuiet aria-label="Switch view"><ListBulletedIcon /></ActionButton>
            </div>
          </div>
        </header>

        <div className="files-grid-wrap">
          <CardView
            aria-label="Files"
            layout="grid"
            size="S"
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            onAction={(key) => openFile(String(key))}
            items={FILES}
            UNSAFE_className="files-grid"
            renderActionBar={(keys) => {
              const count = keys === "all" ? FILES.length : keys.size;
              return (
                <ActionBar
                  isEmphasized
                  selectedItemCount={keys === "all" ? "all" : keys.size}
                  onClearSelection={() => setSelectedKeys(new Set())}
                  UNSAFE_className="files-action-bar"
                >
                  {count === 1 ? (
                    <>
                      <ActionButton><OpenInIcon /><Text>Open</Text></ActionButton>
                      <ActionButton><ShareIcon /><Text>Share</Text></ActionButton>
                      <ActionButton><CopyIcon /><Text>Copy link</Text></ActionButton>
                      <ActionButton><RenameIcon /><Text>Rename</Text></ActionButton>
                      <ActionButton><DuplicateIcon /><Text>Duplicate</Text></ActionButton>
                      <ActionButton aria-label="More actions"><MoreIcon /></ActionButton>
                    </>
                  ) : (
                    <>
                      <ActionButton><DuplicateIcon /><Text>Duplicate</Text></ActionButton>
                      <ActionButton><FolderMoveToIcon /><Text>Move</Text></ActionButton>
                      <ActionButton><DeleteIcon /><Text>Delete</Text></ActionButton>
                      <ActionButton aria-label="More actions"><MoreIcon /></ActionButton>
                    </>
                  )}
                </ActionBar>
              );
            }}
          >
            {(file) => (
              <AssetCard textValue={file.name}>
                <CardPreview>
                  <Image src={file.thumbnail} alt="" />
                  <FileBadge kind={file.kind} />
                </CardPreview>
                <Content>
                  <Text slot="title">{file.name}</Text>
                  <ActionMenu aria-label="More actions">
                    <MenuSection aria-label="Open actions">
                      <MenuItem textValue="Open">
                        <OpenInIcon />
                        <Text slot="label">Open</Text>
                      </MenuItem>
                      {(file.kind === "image" || file.kind === "video") && (
                        <MenuItem textValue="Open in Boards">
                          <ArtboardIcon />
                          <Text slot="label">Open in Boards</Text>
                        </MenuItem>
                      )}
                      {(file.kind === "image" || file.kind === "video") && (
                        <MenuItem textValue="Edit in Firefly" onAction={() => setPlaceholderApp("Firefly")}>
                          <FireflyMnemonicIcon />
                          <Text slot="label">Edit in Firefly</Text>
                        </MenuItem>
                      )}
                    </MenuSection>
                    {CONTEXT_ACTIONS[file.kind] && (
                      <MenuSection aria-label="Context actions">
                        {CONTEXT_ACTIONS[file.kind]!.map((action) => (
                          <MenuItem
                            key={action.label}
                            textValue={action.label}
                            UNSAFE_className="files-context-action-item"
                            onAction={() => setPlaceholderApp(MNEMONIC_APP_NAME[action.icon])}
                          >
                            <MnemonicIcon kind={action.icon} />
                            <Text slot="label">{action.label}</Text>
                          </MenuItem>
                        ))}
                      </MenuSection>
                    )}
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
                  <Text slot="description">{KIND_FORMAT[file.kind]} • {file.modified}</Text>
                </Content>
              </AssetCard>
            )}
          </CardView>
        </div>
          </>
        )}
      </main>
    </div>
  );
}
