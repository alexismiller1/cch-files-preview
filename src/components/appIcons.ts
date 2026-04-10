import adobeHomeIcon from "../assets/app-icons/adobe_appicon.svg";
import fireflyIcon from "../assets/app-icons/B_app_AdobeFirefly.svg";
import expressIcon from "../assets/app-icons/B_app_AdobeExpress.svg";
import photoshopIcon from "../assets/app-icons/B_app_Photoshop.svg";
import lightroomIcon from "../assets/app-icons/B_app_Lightroom.svg";
import acrobatIcon from "../assets/app-icons/B_app_AdobeAcrobatPro.svg";
import frameioIcon from "../assets/app-icons/Frame.io.svg";
import stockIcon from "../assets/app-icons/B_app_Stock.svg";
import fontsIcon from "../assets/app-icons/B_app_AdobeFonts.svg";

/** App id → icon URL (shared by Top App Bar and App header bar) */
export const APP_ICONS: Record<string, string> = {
  home: adobeHomeIcon,
  firefly: fireflyIcon,
  express: expressIcon,
  photoshop: photoshopIcon,
  lightroom: lightroomIcon,
  acrobat: acrobatIcon,
  frameio: frameioIcon,
  stock: stockIcon,
  fonts: fontsIcon,
};
