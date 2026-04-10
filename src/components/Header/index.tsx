import { useMemo, useRef, useState } from "react";
import { Button, ActionButton, Avatar, Picker, PickerItem, MenuTrigger, Menu, MenuItem, Text } from "@react-spectrum/s2";
import GiftIcon from "@react-spectrum/s2/icons/Gift";
import HelpCircleIcon from "@react-spectrum/s2/icons/HelpCircle";
import BellIcon from "@react-spectrum/s2/icons/Bell";
import MenuHamburgerIcon from "@react-spectrum/s2/icons/MenuHamburger";
import AppsAllIcon from "@react-spectrum/s2/icons/AppsAll";
import { useSelectedApp } from "../../context/SelectedAppContext";
import { DEFAULT_APPS, dedupeAppsById, MORE_APPS } from "../topAppBarApps";
import { AppSwitcher } from "../AppSwitcher";
import { NAV_ITEMS } from "../PrimaryNav";
import adobeLogo from "../../assets/adobe-logo.svg";
import avatarImg from "../../assets/avatars/pen_avatar_128px.png";
import "./Header.css";

type HeaderProps = {
  insetLogo?: boolean;
  selectedNavId?: string;
  onNavSelect?: (id: string) => void;
};

export function Header({ insetLogo, selectedNavId, onNavSelect }: HeaderProps) {
  const { selectedAppId, setSelectedAppId } = useSelectedApp();
  const [appSwitcherOpen, setAppSwitcherOpen] = useState(false);
  const appSwitcherTriggerRef = useRef<HTMLDivElement>(null);
  const webApps = useMemo(() => dedupeAppsById([...DEFAULT_APPS, ...MORE_APPS]), []);

  return (
    <header className={`header${insetLogo ? " header--inset-logo" : ""}`}>
      {/* Hamburger menu — visible only at mobile breakpoint */}
      <div className="header-hamburger">
        <MenuTrigger>
          <ActionButton isQuiet aria-label="Navigation menu">
            <MenuHamburgerIcon />
          </ActionButton>
          <Menu
            selectedKeys={selectedNavId ? [selectedNavId] : []}
            onAction={(key) => onNavSelect?.(key as string)}
          >
            {NAV_ITEMS.map(({ id, label, Icon }) => (
              <MenuItem key={id} id={id} textValue={label}>
                <Icon />
                <Text slot="label">{label}</Text>
              </MenuItem>
            ))}
          </Menu>
        </MenuTrigger>
      </div>

      <div className="header-logo">
        <img src={adobeLogo} alt="Adobe" className="header-logo-img" />
      </div>

      <div className="header-spacer" />

      {/* Right actions — hidden at mobile breakpoint */}
      <div className="header-desktop-actions">
        <Picker aria-label="Explore plans" placeholder="Explore plans" size="M" isQuiet UNSAFE_style={{ marginRight: 8 }}>
          <PickerItem id="all-plans">All plans</PickerItem>
          <PickerItem id="individual">Individual</PickerItem>
          <PickerItem id="business">Business</PickerItem>
          <PickerItem id="education">Education</PickerItem>
        </Picker>

        <Button variant="primary" size="M">Desktop apps</Button>

        <div className="header-divider" />
      </div>

      <div className="header-toolbar">
        <ActionButton isQuiet aria-label="What's new"><GiftIcon /></ActionButton>
        <ActionButton isQuiet aria-label="Help"><HelpCircleIcon /></ActionButton>
        <ActionButton isQuiet aria-label="Notifications"><BellIcon /></ActionButton>
        <div ref={appSwitcherTriggerRef} className="header-mobile-apps">
          <ActionButton
            isQuiet
            aria-label={appSwitcherOpen ? "Close app switcher" : "Open app switcher"}
            aria-expanded={appSwitcherOpen}
            aria-haspopup="dialog"
            onPress={() => setAppSwitcherOpen((open) => !open)}
          >
            <AppsAllIcon />
          </ActionButton>
        </div>
        <Avatar src={avatarImg} alt="User" size={24} UNSAFE_style={{ marginLeft: 8 }} />
      </div>

      <AppSwitcher
        isOpen={appSwitcherOpen}
        onClose={() => setAppSwitcherOpen(false)}
        triggerRef={appSwitcherTriggerRef}
        webApps={webApps}
        selectedAppId={selectedAppId}
        onSelectApp={setSelectedAppId}
        onAdobeHome={() => setSelectedAppId("home")}
        onAllApps={() => {}}
      />
    </header>
  );
}
