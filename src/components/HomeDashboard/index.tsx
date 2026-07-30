import { useState } from "react";
import {
  ActionButton,
  Button,
  Picker,
  PickerItem,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Text,
} from "@react-spectrum/s2";
import ImageAddIcon from "@react-spectrum/s2/icons/ImageAdd";
import ImageIcon from "@react-spectrum/s2/icons/Image";
import VideoIcon from "@react-spectrum/s2/icons/Video";
import PathIcon from "@react-spectrum/s2/icons/Path";
import AudioWaveIcon from "@react-spectrum/s2/icons/AudioWave";
import PropertiesIcon from "@react-spectrum/s2/icons/Properties";
import MagicWandIcon from "@react-spectrum/s2/icons/MagicWand";
import fireflyAppIcon from "../../assets/adobe-mnemonics/fi_appicon.svg";
import psAppIcon from "../../assets/adobe-mnemonics/ps_appicon.svg";
import acrobatAppIcon from "../../assets/adobe-mnemonics/acrobat_reader_appicon.svg";
import illustratorAppIcon from "../../assets/adobe-mnemonics/ai_appicon.svg";
import premiereAppIcon from "../../assets/adobe-mnemonics/pr_appicon.svg";
import lightroomAppIcon from "../../assets/adobe-mnemonics/lr_appicon.svg";
import heroBg from "../../assets/home-dashboard/hero-bg.jpg";
import suggestedUpscale from "../../assets/home-dashboard/suggested-upscale.jpg";
import suggestedExtend from "../../assets/home-dashboard/suggested-extend.jpg";
import suggestedGenerateBg from "../../assets/home-dashboard/suggested-generate-bg.jpg";
import card1 from "../../assets/home-dashboard/card1.jpg";
import card2 from "../../assets/home-dashboard/card2.jpg";
import card3 from "../../assets/home-dashboard/card3.jpg";
import card4 from "../../assets/home-dashboard/card4.jpg";
import card5 from "../../assets/home-dashboard/card5.jpg";
import card6 from "../../assets/home-dashboard/card6.jpg";
import card7 from "../../assets/home-dashboard/card7.jpg";
import card8 from "../../assets/home-dashboard/card8.jpg";
import "./HomeDashboard.css";

const MODALITY_OPTIONS = [
  { id: "image", label: "Image", Icon: ImageIcon },
  { id: "video", label: "Video", Icon: VideoIcon },
  { id: "vector", label: "Vector", Icon: PathIcon },
  { id: "audio", label: "Audio", Icon: AudioWaveIcon },
];

const TABS = ["Featured", "Generative AI", "Imaging", "Video", "Design", "Document", "3D"];

const DESKTOP_APPS = [
  { icon: psAppIcon, name: "Photoshop", description: "Create beautiful graphics, photos, and art anywhere.", buttonLabel: "Open" },
  { icon: acrobatAppIcon, name: "Acrobat", description: "View, share, or comment on PDFs for free.", buttonLabel: "Open" },
  { icon: illustratorAppIcon, name: "Illustrator", description: "Create stunning illustrations and graphics.", buttonLabel: "Launch" },
  { icon: premiereAppIcon, name: "Premiere", description: "Edit and craft polished films and video.", buttonLabel: "Open" },
];

const SUGGESTED_CARDS = [
  { image: suggestedUpscale, label: "Upscale image" },
  { image: suggestedExtend, label: "Extend image" },
  { image: suggestedGenerateBg, label: "Generate background" },
];

type MoreWaysCard = {
  image: string;
  before?: string;
  highlight: string;
  after?: string;
  color: string;
  icon: string;
  label: string;
};

const MORE_WAYS_CARDS: MoreWaysCard[] = [
  { image: card1, highlight: "Create high quality images", after: " with a detailed text prompt", color: "#d73220", icon: fireflyAppIcon, label: "Adobe Firefly" },
  { image: card2, highlight: "Erase unwanted objects", after: " with a brush selection", color: "#0b78b3", icon: psAppIcon, label: "Photoshop" },
  { image: card3, highlight: "Upscale images by 2x or 4x", after: " and preserve details.", color: "#d73220", icon: fireflyAppIcon, label: "Adobe Firefly" },
  { image: card4, highlight: "Create a video based on your reference images", after: " as the start and end frame", color: "#d73220", icon: fireflyAppIcon, label: "Adobe Firefly" },
  { image: card5, highlight: "Expand an image ", after: "beyond its edges to fit any canvas.", color: "#d73220", icon: acrobatAppIcon, label: "Acrobat" },
  { image: card6, before: "Use a text prompt to ", highlight: "swap out a photo background", after: ".", color: "#d73220", icon: fireflyAppIcon, label: "Adobe Firefly" },
  { image: card7, highlight: "Start a moodboard ", after: "and iterate on your ideas", color: "#0b78b3", icon: lightroomAppIcon, label: "Adobe Firefly" },
  { image: card8, highlight: "Generate a video clip ", after: "from a descriptive text prompt", color: "#d73220", icon: fireflyAppIcon, label: "Adobe Firefly" },
];

export function HomeDashboard() {
  const [tab, setTab] = useState("Featured");

  return (
    <div className="home-dashboard">
      <div className="home-dashboard-hero">
        <img src={heroBg} alt="" className="home-dashboard-hero-bg" />
        <div className="home-dashboard-hero-fade" />
        <div className="home-dashboard-hero-content">
          <h1 className="home-dashboard-hero-heading">Generate. Edit. Transform.</h1>

          <div className="home-prompt-bar">
            <div className="home-prompt-upload">
              <ImageAddIcon />
              <span>Upload image</span>
            </div>

            <div className="home-prompt-main">
              <div className="home-prompt-text">
                <span className="home-prompt-label">Prompt</span>
                <span className="home-prompt-placeholder">Choose a model and describe what you want to generate</span>
              </div>

              <div className="home-prompt-controls">
                <div className="home-prompt-controls-left">
                  <Picker aria-label="Modality" defaultSelectedKey="image" items={MODALITY_OPTIONS} size="M">
                    {(item) => (
                      <PickerItem textValue={item.label}>
                        <item.Icon />
                        <Text slot="label">{item.label}</Text>
                      </PickerItem>
                    )}
                  </Picker>
                  <div className="home-prompt-model">
                    <img src={fireflyAppIcon} alt="" className="home-prompt-model-icon" />
                    <Picker aria-label="Model" defaultSelectedKey="firefly-image-5" isQuiet size="M">
                      <PickerItem id="firefly-image-5" textValue="Firefly Image 5 (preview)">
                        <Text slot="label">Firefly Image 5 (preview)</Text>
                      </PickerItem>
                    </Picker>
                  </div>
                  <ActionButton isQuiet aria-label="More options"><PropertiesIcon /></ActionButton>
                </div>
                <Button variant="primary" UNSAFE_className="home-prompt-generate">
                  <MagicWandIcon />
                  <Text>Generate</Text>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="home-dashboard-body">
        <Tabs aria-label="Recommended next actions" selectedKey={tab} onSelectionChange={(key) => setTab(String(key))} UNSAFE_className="home-dashboard-tabs">
          <TabList>
            {TABS.map((label) => (
              <Tab key={label} id={label}>{label}</Tab>
            ))}
          </TabList>
          {TABS.map((label) => (
            <TabPanel key={label} id={label}>
              <section className="home-desktop-banner">
                <div className="home-desktop-banner-hero">
                  <p className="home-desktop-banner-title">Desktop apps</p>
                  <p className="home-desktop-banner-description">
                    Install and update apps with Creative Cloud, or <a href="#">view all apps.</a>
                  </p>
                  <Button variant="primary" UNSAFE_className="home-desktop-banner-cta">Launch Creative Cloud</Button>
                </div>
                <div className="home-desktop-apps">
                  {DESKTOP_APPS.map((app) => (
                    <div className="home-desktop-app" key={app.name}>
                      <img src={app.icon} alt="" className="home-desktop-app-icon" />
                      <p className="home-desktop-app-name">{app.name}</p>
                      <p className="home-desktop-app-description">{app.description}</p>
                      <Button variant="secondary" UNSAFE_className="home-desktop-app-button">{app.buttonLabel}</Button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="home-suggested-section">
                <h2 className="home-section-heading">Create with Firefly</h2>
                <div className="home-suggested-cards">
                  {SUGGESTED_CARDS.map((card) => (
                    <button type="button" className="home-suggested-card" key={card.label}>
                      <img src={card.image} alt="" className="home-suggested-card-image" />
                      <div className="home-suggested-card-scrim" />
                      <span className="home-suggested-card-label">{card.label}</span>
                      <span className="home-suggested-card-try">Try it</span>
                    </button>
                  ))}
                </div>
              </section>

              <section className="home-more-ways-section">
                <h2 className="home-section-heading">More ways to create</h2>
                <div className="home-more-cards">
                  {MORE_WAYS_CARDS.map((card, i) => (
                    <div className="home-more-card" key={i}>
                      <div className="home-more-card-image-wrap">
                        <img src={card.image} alt="" className="home-more-card-image" />
                      </div>
                      <p className="home-more-card-title">
                        {card.before}
                        <span style={{ color: card.color }}>{card.highlight}</span>
                        {card.after}
                      </p>
                      <div className="home-more-card-footer">
                        <img src={card.icon} alt="" className="home-more-card-footer-icon" />
                        <span>{card.label}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </TabPanel>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
