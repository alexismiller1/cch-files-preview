import { useSelectedApp } from "../../context/SelectedAppContext";
import { displayHostnameForAppId } from "../../utils/appDisplayHostname";
import iconBack from "../../assets/safari-icons/back.svg";
import iconBookmarks from "../../assets/safari-icons/bookmarks.svg";
import iconForward from "../../assets/safari-icons/forward.svg";
import iconLock from "../../assets/safari-icons/lock.svg";
import iconRefresh from "../../assets/safari-icons/refresh.svg";
import iconShare from "../../assets/safari-icons/share.svg";
import iconTabs from "../../assets/safari-icons/tabs.svg";
import iconTextSize from "../../assets/safari-icons/text-size.svg";

/**
 * iOS Safari browser control bar - address bar and navigation icons.
 * Designed for iPhone device frame (402px width).
 */
export function SafariBrowserBar() {
  const { selectedAppId, homeNavId } = useSelectedApp();
  const displayUrl = displayHostnameForAppId(selectedAppId, homeNavId);

  return (
    <div className="safari-browser-bar" data-node-id="92:3243">
      <div className="safari-browser-bar__bg" aria-hidden />
      <div className="safari-browser-bar__address-bar">
        <div className="safari-browser-bar__address-input" />
        <button type="button" className="safari-browser-bar__btn safari-browser-bar__btn--text-size" aria-label="Text size">
          <img src={iconTextSize} alt="" className="safari-browser-bar__img" aria-hidden />
        </button>
        <div className="safari-browser-bar__address">
          <span className="safari-browser-bar__lock" aria-hidden>
            <img src={iconLock} alt="" className="safari-browser-bar__img" aria-hidden />
          </span>
          <span className="safari-browser-bar__url">{displayUrl}</span>
        </div>
        <button type="button" className="safari-browser-bar__btn safari-browser-bar__btn--refresh" aria-label="Refresh">
          <img src={iconRefresh} alt="" className="safari-browser-bar__img" aria-hidden />
        </button>
      </div>
      <div className="safari-browser-bar__nav" role="toolbar" aria-label="Safari navigation">
        <button type="button" className="safari-browser-bar__nav-btn" aria-label="Back">
          <img src={iconBack} alt="" className="safari-browser-bar__img" aria-hidden />
        </button>
        <button type="button" className="safari-browser-bar__nav-btn" aria-label="Forward">
          <img src={iconForward} alt="" className="safari-browser-bar__img" aria-hidden />
        </button>
        <button type="button" className="safari-browser-bar__nav-btn" aria-label="Share">
          <img src={iconShare} alt="" className="safari-browser-bar__img" aria-hidden />
        </button>
        <button type="button" className="safari-browser-bar__nav-btn" aria-label="Bookmarks">
          <img src={iconBookmarks} alt="" className="safari-browser-bar__img" aria-hidden />
        </button>
        <button type="button" className="safari-browser-bar__nav-btn" aria-label="Tab overview">
          <img src={iconTabs} alt="" className="safari-browser-bar__img" aria-hidden />
        </button>
      </div>
    </div>
  );
}

export default SafariBrowserBar;
