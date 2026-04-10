import { ToggleButton } from "@react-spectrum/s2";
import HomeIcon from "@react-spectrum/s2/icons/Home";
import AppsIcon from "@react-spectrum/s2/icons/Apps";
import FolderIcon from "@react-spectrum/s2/icons/Folder";
import RibbonIcon from "@react-spectrum/s2/icons/Ribbon";
import "./PrimaryNav.css";

export const NAV_ITEMS = [
  { id: "home", label: "Home", Icon: HomeIcon },
  { id: "apps", label: "Apps", Icon: AppsIcon },
  { id: "files", label: "Files", Icon: FolderIcon },
  { id: "benefits", label: "Benefits", Icon: RibbonIcon },
];

type PrimaryNavProps = {
  selectedId: string;
  onSelect: (id: string) => void;
};

export function PrimaryNav({ selectedId, onSelect }: PrimaryNavProps) {
  return (
    <nav className="primary-nav" aria-label="Primary navigation">
      {NAV_ITEMS.map(({ id, label, Icon }) => {
        const active = id === selectedId;
        return (
          <div
            key={id}
            className={`primary-nav-item${active ? " primary-nav-item--active" : ""}`}
            onClick={() => onSelect(id)}
          >
            <ToggleButton
              isQuiet
              isSelected={active}
              onChange={() => onSelect(id)}
              aria-label={label}
            >
              <Icon />
            </ToggleButton>
            <span className="primary-nav-label">{label}</span>
          </div>
        );
      })}
    </nav>
  );
}
