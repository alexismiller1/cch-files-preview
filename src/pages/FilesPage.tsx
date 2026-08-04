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
import MagicWandIcon from "@react-spectrum/s2/icons/MagicWand";
import CloseIcon from "@react-spectrum/s2/icons/Close";
import { FilesLeftNav } from "../components/FilesLeftNav";
import { FireflyMnemonicIcon, MnemonicIcon } from "../components/MnemonicIcons";
import { FilePreviewModal } from "../components/FilePreviewModal";
import {
  FILES,
  FileBadge,
  KIND_FORMAT,
  CONTEXT_ACTIONS,
  MNEMONIC_APP_NAME,
  EXTRA_OPEN_ACTIONS,
  KINDS_WITHOUT_GENERIC_OPEN,
} from "../data/filesData";
import { useSelectedApp } from "../context/SelectedAppContext";
import { useDisplayConfig } from "../context/DisplayConfigContext";
import "./FilesPage.css";

const FILTER_OPTIONS = [
  { id: "all", label: "All", Icon: AppsAllIcon },
  { id: "photos", label: "Photos", Icon: ImageIcon },
  { id: "documents", label: "Documents", Icon: FileTextIcon },
  { id: "videos", label: "Videos", Icon: VideoIcon },
];

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
  const { previewMode } = useDisplayConfig();
  const [leftNavSelectedId, setLeftNavSelectedId] = useState("files");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  const [previewFileId, setPreviewFileId] = useState<string | null>(null);
  const [showAiBanner, setShowAiBanner] = useState(true);

  const previewFile = FILES.find((file) => file.id === previewFileId) ?? null;
  const isSplitActive = previewMode === "split" && previewFile !== null;

  const navigatePreview = (direction: "prev" | "next") => {
    if (!previewFile) return;
    const index = FILES.findIndex((f) => f.id === previewFile.id);
    if (index === -1) return;
    const nextIndex =
      direction === "next" ? (index + 1) % FILES.length : (index - 1 + FILES.length) % FILES.length;
    setPreviewFileId(FILES[nextIndex].id);
  };

  return (
    <div className="app-frame-content files-page">
      <div className={`files-left-nav-wrap ${isSplitActive ? "files-left-nav-wrap--collapsed" : ""}`}>
        <FilesLeftNav selectedId={leftNavSelectedId} onSelect={setLeftNavSelectedId} />
      </div>

      <main className="files-main">
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
            onAction={(key) => setPreviewFileId(String(key))}
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
                      {!KINDS_WITHOUT_GENERIC_OPEN.includes(file.kind) && (
                        <MenuItem textValue="Open">
                          <OpenInIcon />
                          <Text slot="label">Open</Text>
                        </MenuItem>
                      )}
                      {EXTRA_OPEN_ACTIONS[file.kind]?.map((action) => (
                        <MenuItem
                          key={action.label}
                          textValue={action.label}
                          onAction={() => setPlaceholderApp(action.appName)}
                        >
                          {action.icon === "firefly" ? <FireflyMnemonicIcon /> : <ArtboardIcon />}
                          <Text slot="label">{action.label}</Text>
                        </MenuItem>
                      ))}
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
      </main>

      {previewFile && (
        <FilePreviewModal
          size={previewMode === "action-tab" || previewMode === "consolidated-open" ? "fullscreen" : previewMode}
          showActionsTab={previewMode === "action-tab" || previewMode === "consolidated-open"}
          consolidatedOpenMenu={previewMode === "consolidated-open"}
          file={previewFile}
          onClose={() => setPreviewFileId(null)}
          onNavigate={navigatePreview}
          onOpenApp={(appName) => {
            setPreviewFileId(null);
            setPlaceholderApp(appName);
          }}
          onQuickAction={(icon) => {
            setPreviewFileId(null);
            setPlaceholderApp(MNEMONIC_APP_NAME[icon]);
          }}
        />
      )}
    </div>
  );
}
