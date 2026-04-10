import adobeHomeIcon from "../assets/adobe-mnemonics/adobehome_appicon.svg";
import fireflyIcon from "../assets/adobe-mnemonics/fi_appicon.svg";
import expressIcon from "../assets/adobe-mnemonics/adobeexpress_appicon.svg";
import photoshopIcon from "../assets/adobe-mnemonics/ps_appicon.svg";
import lightroomIcon from "../assets/adobe-mnemonics/lr_appicon.svg";
import acrobatIcon from "../assets/adobe-mnemonics/acrobat_reader_appicon.svg";
import frameioIcon from "../assets/adobe-mnemonics/Frame.io.svg";
import stockIcon from "../assets/adobe-mnemonics/st_appicon.svg";
import fontsIcon from "../assets/adobe-mnemonics/adobe_fonts_appicon.svg";

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
