import { Button, ActionButton, Avatar, Picker, PickerItem } from "@react-spectrum/s2";
import GiftIcon from "@react-spectrum/s2/icons/Gift";
import HelpCircleIcon from "@react-spectrum/s2/icons/HelpCircle";
import BellIcon from "@react-spectrum/s2/icons/Bell";
import adobeLogo from "../../assets/adobe-logo.svg";
import avatarImg from "../../assets/avatars/pen_avatar_128px.png";
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
      <Picker aria-label="Explore plans" placeholder="Explore plans" size="M" isQuiet UNSAFE_style={{ marginRight: 8 }}>
        <PickerItem id="all-plans">All plans</PickerItem>
        <PickerItem id="individual">Individual</PickerItem>
        <PickerItem id="business">Business</PickerItem>
        <PickerItem id="education">Education</PickerItem>
      </Picker>

      <Button variant="primary" size="M">Desktop apps</Button>

      <div className="header-divider" />

      <div className="header-toolbar">
        <ActionButton isQuiet aria-label="What's new"><GiftIcon /></ActionButton>
        <ActionButton isQuiet aria-label="Help"><HelpCircleIcon /></ActionButton>
        <ActionButton isQuiet aria-label="Notifications"><BellIcon /></ActionButton>
        <Avatar src={avatarImg} alt="User" size={24} UNSAFE_style={{ marginLeft: 8 }} />
      </div>
    </header>
  );
}
