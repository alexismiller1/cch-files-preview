import { ToggleButton } from "@react-spectrum/s2";
import HomeIcon from "@react-spectrum/s2/icons/Home";
import MagicWandIcon from "@react-spectrum/s2/icons/MagicWand";
import AppsIcon from "@react-spectrum/s2/icons/Apps";
import FolderIcon from "@react-spectrum/s2/icons/Folder";
import RibbonIcon from "@react-spectrum/s2/icons/Ribbon";
import ToolsIcon from "@react-spectrum/s2/icons/Tools";
import MarketIcon from "@react-spectrum/s2/icons/Market";
import { useDisplayConfig } from "../../context/DisplayConfigContext";
import "./PrimaryNav.css";

export const NAV_ITEMS = [
  { id: "home", label: "Home", Icon: HomeIcon },
  { id: "ai-assistant", label: "AI Assistant", Icon: MagicWandIcon },
  { id: "apps", label: "Apps", Icon: AppsIcon },
  { id: "files", label: "Files", Icon: FolderIcon },
  { id: "benefits", label: "Benefits", Icon: RibbonIcon },
  { id: "create", label: "Create", Icon: ToolsIcon },
];

const CCD_NAV_ITEM = { id: "stock-marketplace", label: "Stock & Marketplace", Icon: MarketIcon };

type PrimaryNavProps = {
  selectedId: string;
  onSelect: (id: string) => void;
};

export function PrimaryNav({ selectedId, onSelect }: PrimaryNavProps) {
  const { appMode } = useDisplayConfig();
  const items = appMode === "cc-desktop" ? [...NAV_ITEMS, CCD_NAV_ITEM] : NAV_ITEMS;

  return (
    <nav className="primary-nav" aria-label="Primary navigation">
      {items.map(({ id, label, Icon }) => {
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
