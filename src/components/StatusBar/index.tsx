import { useEffect, useState } from "react";
import iosCellular from "../../assets/status-bar/ios-cellular.svg";
import iosWifi from "../../assets/status-bar/ios-wifi.svg";
import iosBattery from "../../assets/status-bar/ios-battery.svg";

function formatStatusBarTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  });
}

type StatusBarProps = {
  className?: string;
};

/**
 * iOS Status Bar - time, Dynamic Island spacer, and system icons (cellular, wifi, battery).
 * Designed for iPhone device frame (402px width).
 */
export function StatusBar({ className }: StatusBarProps) {
  const [time, setTime] = useState(() => formatStatusBarTime(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(formatStatusBarTime(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`status-bar ${className ?? ""}`.trim()} data-node-id="82:2838">
      <div className="status-bar__frame">
        <div className="status-bar__time">{time}</div>
        <div className="status-bar__dynamic-island-spacer" aria-hidden />
        <div className="status-bar__levels">
          <img src={iosCellular} alt="" className="status-bar__icon" aria-hidden />
          <img src={iosWifi} alt="" className="status-bar__icon" aria-hidden />
          <img src={iosBattery} alt="" className="status-bar__icon" aria-hidden />
        </div>
      </div>
    </div>
  );
}

export default StatusBar;
