import { SearchField, Button, ActionButton, Avatar } from "@react-spectrum/s2";
import GiftIcon from "@react-spectrum/s2/icons/Gift";
import HelpCircleIcon from "@react-spectrum/s2/icons/HelpCircle";
import BellIcon from "@react-spectrum/s2/icons/Bell";
import ChevronIcon from "@react-spectrum/s2/icons/ChevronDown";
import adobeLogo from "../../assets/adobe-logo.svg";
import "./Header.css";

type HeaderProps = {
  insetLogo?: boolean;
};

export function Header({ insetLogo }: HeaderProps) {
  return (
    <header className={`header${insetLogo ? " header--inset-logo" : ""}`}>
      <div className="header-logo">
        <img src={adobeLogo} alt="Adobe" className="header-logo-img" />
      </div>

      <div className="header-spacer" />

      {/* Right actions */}
      <button type="button" className="header-explore-plans">
        <span>Explore plans</span>
        <ChevronIcon />
      </button>

      <Button variant="primary" size="M">Desktop apps</Button>

      <div className="header-divider" />

      <ActionButton isQuiet aria-label="What's new"><GiftIcon /></ActionButton>
      <ActionButton isQuiet aria-label="Help"><HelpCircleIcon /></ActionButton>
      <ActionButton isQuiet aria-label="Notifications"><BellIcon /></ActionButton>
      <Avatar src="" alt="User" size={24} />
    </header>
  );
}
