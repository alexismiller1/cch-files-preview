import FileIcon from "@react-spectrum/s2/icons/File";
import UserGroupIcon from "@react-spectrum/s2/icons/UserGroup";
import ProjectIcon from "@react-spectrum/s2/icons/Project";
import CCLibraryIcon from "@react-spectrum/s2/icons/CCLibrary";
import DeleteIcon from "@react-spectrum/s2/icons/Delete";
import DeviceLaptopIcon from "@react-spectrum/s2/icons/DeviceLaptop";
import stockMnemonic from "../../assets/adobe-mnemonics/st_appicon.svg";
import fireflyMnemonic from "../../assets/adobe-mnemonics/fi_appicon.svg";
import frameioMnemonic from "../../assets/adobe-mnemonics/Frame.io.svg";
import "./FilesLeftNav.css";

const NAV_ITEMS = [
  { id: "files", label: "Your files", Icon: FileIcon },
  { id: "shared", label: "Shared with you", Icon: UserGroupIcon },
  { id: "projects", label: "Projects", Icon: ProjectIcon },
  { id: "stock", label: "Licensed Stock assets", iconSrc: stockMnemonic },
  { id: "libraries", label: "Your libraries", Icon: CCLibraryIcon },
  { id: "generation-history", label: "Generation history", iconSrc: fireflyMnemonic },
  { id: "frameio", label: "Frame.io", iconSrc: frameioMnemonic },
  { id: "deleted", label: "Deleted", Icon: DeleteIcon },
];

type FilesLeftNavProps = {
  selectedId: string;
  onSelect: (id: string) => void;
};

export function FilesLeftNav({ selectedId, onSelect }: FilesLeftNavProps) {
  return (
    <nav className="files-left-nav" aria-label="Files navigation">
      <div className="files-left-nav-group">
        {NAV_ITEMS.map(({ id, label, Icon, iconSrc }) => (
          <button
            key={id}
            type="button"
            className={`files-left-nav-item${id === selectedId ? " files-left-nav-item--active" : ""}`}
            onClick={() => onSelect(id)}
          >
            {Icon ? <Icon /> : <img src={iconSrc} alt="" className="files-left-nav-item-mnemonic" />}
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="files-left-nav-group">
        <span className="files-left-nav-section-label">Other storage</span>
        <button
          type="button"
          className={`files-left-nav-item${selectedId === "local-storage" ? " files-left-nav-item--active" : ""}`}
          onClick={() => onSelect("local-storage")}
        >
          <DeviceLaptopIcon />
          <span>Local storage</span>
        </button>
      </div>
    </nav>
  );
}
