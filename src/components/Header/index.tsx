import { useMemo, useRef, useState } from "react";
import { Button, ActionButton, Avatar, Picker, PickerItem, MenuTrigger, Menu, MenuItem, Text, Divider } from "@react-spectrum/s2";
import GiftIcon from "@react-spectrum/s2/icons/Gift";
import HelpCircleIcon from "@react-spectrum/s2/icons/HelpCircle";
import BellIcon from "@react-spectrum/s2/icons/Bell";
import MenuHamburgerIcon from "@react-spectrum/s2/icons/MenuHamburger";
import AppsAllIcon from "@react-spectrum/s2/icons/AppsAll";
import { useSelectedApp } from "../../context/SelectedAppContext";
import { DEFAULT_APPS, dedupeAppsById, MORE_APPS } from "../topAppBarApps";
import { AppSwitcher } from "../AppSwitcher";
import { NAV_ITEMS } from "../PrimaryNav";
import avatarImg from "../../assets/avatars/pen_avatar_128px.png";
import "./Header.css";

function AdobeLogo({ className }: { className?: string }) {
  return (
    <svg className={className} width="66" height="16" viewBox="0 0 66 16" fill="currentColor" aria-label="Adobe">
      <path d="M10.2296 15.6133L8.9762 12.1509H5.83265L8.47566 5.54348L12.4852 15.6133H17.2466L10.8904 0.452423H6.4023L0 15.6133H10.2296ZM27.9318 14.9341V0H23.9673V3.75667C23.4657 3.6433 22.9871 3.59858 22.5096 3.59858C19.4572 3.59858 16.5178 5.70261 16.5178 9.82122C16.5178 13.9398 19.5483 15.84 23.1243 15.84C25.0835 15.84 27.0197 15.3418 27.9318 14.9352V14.9341ZM20.4813 9.75257C20.4813 7.73903 21.6886 6.76554 23.0102 6.76554C23.3746 6.76554 23.6939 6.83315 23.9673 6.94651V12.4453C23.6939 12.5358 23.3746 12.5815 23.0332 12.5815C21.7117 12.5815 20.4813 11.6985 20.4813 9.75257ZM41.1228 9.70785C41.1228 5.81597 38.3206 3.59858 34.9938 3.59858C31.667 3.59858 28.8878 5.81597 28.8878 9.70785C28.8878 13.5997 31.667 15.8171 34.9938 15.8171C38.3206 15.8171 41.1228 13.5997 41.1228 9.70785ZM32.8293 9.70785C32.8293 7.78479 33.8314 6.87891 34.9938 6.87891C36.1561 6.87891 37.1813 7.78375 37.1813 9.70785C37.1813 11.6319 36.1561 12.5368 34.9938 12.5368C33.8314 12.5368 32.8293 11.6319 32.8293 9.70785ZM53.5158 9.54872C53.5158 5.61108 50.6456 3.57466 47.524 3.57466C47.0455 3.57466 46.5449 3.64226 46.0433 3.73275V0H42.0788V14.957C43.3092 15.5228 45.2685 15.84 46.8172 15.84C50.4393 15.84 53.5148 13.7131 53.5148 9.54976L53.5158 9.54872ZM47.0004 6.78842C48.322 6.78842 49.5524 7.69327 49.5524 9.59448C49.5524 11.6309 48.2769 12.5815 46.9324 12.5815C46.591 12.5815 46.2947 12.5368 46.0433 12.4453V6.96939C46.3397 6.85603 46.636 6.78842 47.0004 6.78842ZM61.1485 15.8171C62.5842 15.8171 63.9738 15.5685 65.135 14.9799V11.97C63.8816 12.5129 62.7653 12.8072 61.558 12.8072C60.0773 12.8072 58.8919 12.1738 58.4594 10.8384H65.9089C65.977 10.3402 66 9.84306 66 9.32199C66 5.49772 63.2659 3.59754 60.2815 3.59754C57.0919 3.59754 54.4269 5.90542 54.4269 9.68497C54.4269 13.4645 57.3662 15.8171 61.1475 15.8171H61.1485ZM60.3276 6.56169C61.2166 6.56169 62.0816 7.08276 62.2868 8.37242H58.4134C58.7097 7.10564 59.4846 6.56169 60.3276 6.56169Z" />
    </svg>
  );
}

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
        <AdobeLogo className="header-logo-svg" />
      </div>

      <div className="header-spacer" />

      {/* Right actions — hidden at mobile breakpoint */}
      <div className="header-desktop-actions">
        <Picker aria-label="Explore plans" placeholder="Explore plans" size="M" isQuiet UNSAFE_style={{ marginRight: 8 }}>
        </Picker>
        <Button variant="primary" size="M">Desktop apps</Button>
      </div>

      <Divider size="M" orientation="vertical" UNSAFE_style={{ margin: '12px 0', marginLeft: 4 }} />

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
