import { useId } from "react";
import expressAppIconRaw from "../../assets/adobe-mnemonics/adobeexpress_appicon.svg?raw";

type MnemonicIconProps = { className?: string };

/** Inline Firefly mnemonic — MenuItem only slots <svg> icons into its icon grid area, not <img>. */
export function FireflyMnemonicIcon({ className = "files-menu-mnemonic-icon" }: MnemonicIconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M52.5223 0H11.4777C5.13875 0 0 5.13875 0 11.4777V52.5223C0 58.8613 5.13875 64 11.4777 64H52.5223C58.8613 64 64 58.8613 64 52.5223V11.4777C64 5.13875 58.8613 0 52.5223 0Z" fill="#EB1000"/>
      <path d="M16.2105 16.9883H37.7427V23.9895H24.4006V29.0533H36.2015V36.0545H24.4006V46.4903H16.2105V16.9883Z" fill="white"/>
      <path d="M40.5678 23.5052H48.2735V46.4903H40.5678V23.5052Z" fill="white"/>
      <path d="M45.7759 19.2107L48.5231 19.8281C49.6029 20.0714 50.3529 18.778 49.6006 17.9646L47.6917 15.9005C47.4409 15.6278 47.3392 15.2515 47.4206 14.8887L48.0396 12.1487C48.2837 11.0716 46.9868 10.3234 46.1713 11.0738L44.102 12.9779C43.8286 13.228 43.4512 13.3294 43.0876 13.2483L40.3404 12.6309C39.2606 12.3875 38.5105 13.6809 39.2628 14.4944L41.1719 16.5585C41.4226 16.8311 41.5243 17.2074 41.443 17.5702L40.8239 20.3103C40.5799 21.3874 41.8766 22.1355 42.6922 21.3851L44.7616 19.4811C45.0349 19.2309 45.4122 19.1295 45.7759 19.2107Z" fill="white"/>
    </svg>
  );
}

/** Inline Photoshop mnemonic — see FireflyMnemonicIcon for why this can't be an <img>. */
export function PhotoshopMnemonicIcon({ className = "files-menu-mnemonic-icon" }: MnemonicIconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M52.5223 0H11.4777C5.13875 0 0 5.13875 0 11.4777V52.5223C0 58.8613 5.13875 64 11.4777 64H52.5223C58.8613 64 64 58.8613 64 52.5223V11.4777C64 5.13875 58.8613 0 52.5223 0Z" fill="#001E36"/>
      <path d="M22.3483 16.9882C30.7146 16.9882 35.4261 20.9072 35.4261 27.4681C35.4261 35.1298 29.0414 38.2121 23.0529 38.2121H19.0019V46.4903H10.8117V16.9882H22.3483ZM19.0019 23.9894V31.2108H22.6126C25.1225 31.2108 26.8838 30.1981 26.8838 27.6442C26.8838 25.3105 25.3866 23.9894 22.7887 23.9894H19.0019Z" fill="#31A8FF"/>
      <path d="M37.0908 45.0372L37.1349 38.2121C39.4686 39.7533 42.727 40.722 44.9727 40.722C46.5139 40.722 47.2185 40.2816 47.2185 39.489C47.2185 38.6084 46.2497 38.2561 44.4004 37.6837C40.8336 36.6269 36.9148 35.1739 36.9148 30.5063C36.9148 25.7508 40.8336 23.1088 46.5139 23.1088C49.1999 23.1088 51.4016 23.5051 53.3389 24.3417L53.2949 30.8586C51.7537 29.9339 48.7155 29.0973 46.734 29.0973C45.281 29.0973 44.7086 29.5376 44.7086 30.1981C44.7086 30.9907 45.413 31.2109 47.5267 31.8714C51.6218 33.1043 55.0563 34.4253 55.0563 39.2249C55.0563 43.8043 51.3136 46.8866 45.4571 46.8866C42.3747 46.8866 39.4686 46.3582 37.0908 45.0372Z" fill="#31A8FF"/>
    </svg>
  );
}

/** Inline Acrobat mnemonic — see FireflyMnemonicIcon for why this can't be an <img>. */
export function AcrobatMnemonicIcon({ className = "files-menu-mnemonic-icon" }: MnemonicIconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M52.521 -0.00402832H11.479C5.13931 -0.00402832 0 5.13528 0 11.4749V52.517C0 58.8567 5.13931 63.996 11.479 63.996H52.521C58.8607 63.996 64 58.8567 64 52.517V11.4749C64 5.13528 58.8607 -0.00402832 52.521 -0.00402832Z" fill="#B30C00"/>
      <path d="M51.9603 36.971C50.6557 35.5706 48.1613 34.8595 44.5456 34.8595C42.7651 34.8595 40.7548 35.0346 38.5586 35.3792C37.3689 34.2332 36.2092 32.8794 35.1097 31.3532C34.3248 30.2674 33.6 29.1433 32.9518 28C34.2263 23.9932 34.8718 20.7385 34.8718 18.3262C34.8718 15.3642 33.6984 12.1997 30.4054 12.1997C29.3251 12.1997 28.2174 12.8534 27.6485 13.8271C26.2454 16.2394 26.8061 21.2007 29.0489 26.2524C28.2694 28.5717 27.4188 30.8308 26.3767 33.3334C25.5015 35.4476 24.4567 37.611 23.3545 39.6076C19.9959 40.9587 12.8574 44.238 12.1764 47.8619C11.9767 48.9477 12.3213 49.9734 13.1528 50.7501C13.4099 50.9936 14.3918 51.7867 16.0629 51.7867C20.3624 51.7867 24.6509 45.8353 27.5364 40.7098C29.1774 40.1518 30.8513 39.6459 32.5169 39.2055C34.3439 38.7214 36.1107 38.3248 37.7764 38.0267C42.3302 42.0007 46.3754 42.6024 48.4048 42.6024C51.1918 42.6024 52.2338 41.3936 52.614 40.3789C53.1145 39.0524 52.6277 37.6794 51.9631 36.9683L51.9603 36.971ZM48.9955 39.0606C48.8424 39.851 48.0273 40.3597 46.9114 40.3597C46.6051 40.3597 46.2878 40.3214 45.9706 40.2421C43.922 39.7525 41.9583 38.7624 40 37.2199C41.8352 36.9409 43.3832 36.8807 44.4171 36.8807C45.5931 36.8807 46.6707 36.9628 47.36 37.1077C48.2461 37.291 49.2444 37.7806 48.9955 39.0606ZM29.4126 14.8582C29.6342 14.4753 29.9925 14.2428 30.3644 14.2428C31.4065 14.2428 31.6335 15.4982 31.6335 16.5484C31.6417 18.2223 31.1357 20.8917 30.2687 23.8455C28.521 19.2151 28.7644 15.9686 29.4126 14.8582ZM35.5227 35.9426C34.3412 36.1915 33.1186 36.4787 31.8824 36.8069C30.9935 37.0421 30.0909 37.2992 29.1884 37.5754C29.667 36.5936 30.1073 35.6226 30.493 34.6982C30.9989 33.4756 31.4748 32.2558 31.9097 31.0606C32.2926 31.6623 32.6892 32.2476 33.0967 32.8083C33.8981 33.9214 34.7624 34.9826 35.6212 35.9207L35.5254 35.9426H35.5227ZM22.296 42.2797C19.5446 46.7105 16.8369 49.5112 15.2533 49.5112C14.9607 49.5112 14.72 49.4236 14.5477 49.2595C14.2304 48.9641 14.1128 48.6414 14.1866 48.2476C14.4875 46.6612 17.6219 44.3693 22.2988 42.2824L22.296 42.2797Z" fill="white"/>
    </svg>
  );
}

/** Inline Express mnemonic — see FireflyMnemonicIcon for why this can't be an <img>. */
const EXPRESS_ICON_INNER_HTML = expressAppIconRaw
  .replace(/^[\s\S]*?<svg[^>]*>/, "")
  .replace(/<\/svg>\s*$/, "");

export function ExpressMnemonicIcon({ className = "files-menu-mnemonic-icon" }: MnemonicIconProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const html = EXPRESS_ICON_INNER_HTML
    .replaceAll('id="clippath-1"', `id="expressclip1-${uid}"`)
    .replaceAll("url(#clippath-1)", `url(#expressclip1-${uid})`)
    .replaceAll('id="clippath"', `id="expressclip0-${uid}"`)
    .replaceAll("url(#clippath)", `url(#expressclip0-${uid})`);
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** Inline AI Assistant mnemonic — square background uses the same brand color as the AI Assistant
 * highlight text on the Home page's action cards (#ce2a92). See FireflyMnemonicIcon for why this can't be an <img>. */
/** Inline AI Assistant mnemonic — same glyph as the S2 MagicWand icon used for the AI Assistant rail
 * tab, inlined as a raw path (rather than the S2 component) so it can slot into MenuItem the same way
 * as the other mnemonics. See FireflyMnemonicIcon for why this can't be an <img>. */
export function AiAssistantMnemonicIcon({ className = "files-menu-mnemonic-icon" }: MnemonicIconProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        fill="#292929"
        d="M15.05 7.2c0-.601-.235-1.167-.658-1.59-.849-.85-2.333-.852-3.183 0L9.388 7.43q-.033.034-.06.069-.037.029-.07.062l-7.599 7.598c-.425.425-.659.99-.659 1.591s.234 1.166.66 1.59.99.66 1.59.66 1.166-.234 1.59-.66l9.55-9.549c.425-.425.66-.99.66-1.59M3.78 17.28c-.283.283-.777.283-1.06 0-.142-.141-.22-.33-.22-.53s.078-.389.22-.53l7.2-7.2 1.065 1.055zm9.55-9.55-1.284 1.285-1.066-1.056 1.29-1.29c.283-.282.777-.283 1.06.002.142.14.22.329.22.53s-.078.388-.22.53M18.706 10.832l-1.261-.499-.203-1.342c-.065-.428-.758-.505-.916-.104l-.499 1.262-1.342.202c-.213.032-.379.203-.403.418s.098.418.299.498l1.262.5.202 1.34c.032.213.203.38.418.404s.418-.098.498-.3l.5-1.26 1.34-.203c.215-.033.38-.204.404-.418s-.099-.42-.299-.498M14.336 3.642l1.262.5.202 1.341c.032.213.204.38.418.403.215.025.418-.097.498-.299l.5-1.26 1.341-.204c.214-.032.379-.203.403-.418s-.098-.419-.299-.498l-1.26-.498-.204-1.342c-.065-.428-.758-.505-.916-.105l-.498 1.263-1.342.201c-.213.032-.38.204-.404.418s.098.418.3.498M5.78 4.69l1.023.406.164 1.088c.026.173.166.307.34.327.173.02.339-.08.404-.243l.405-1.023 1.088-.165c.174-.026.308-.165.328-.339s-.08-.34-.243-.404l-1.023-.404-.165-1.09c-.053-.347-.615-.41-.743-.084l-.405 1.024-1.089.164c-.173.026-.308.165-.327.34-.02.173.079.338.242.403"
      />
    </svg>
  );
}

/** Wraps an arbitrary raster icon in an <svg> shell so it can slot into MenuItem's icon area — see FireflyMnemonicIcon for why MenuItem needs an <svg>, not an <img>. */
export function PngMnemonicIcon({ src, className = "files-menu-mnemonic-icon" }: { src: string; className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className={className}>
      <image href={src} width="20" height="20" />
    </svg>
  );
}

export type MnemonicKind = "firefly" | "photoshop" | "acrobat" | "express" | "ai-assistant";

export function MnemonicIcon({ kind, className }: { kind: MnemonicKind; className?: string }) {
  if (kind === "photoshop") return <PhotoshopMnemonicIcon className={className} />;
  if (kind === "acrobat") return <AcrobatMnemonicIcon className={className} />;
  if (kind === "express") return <ExpressMnemonicIcon className={className} />;
  if (kind === "ai-assistant") return <AiAssistantMnemonicIcon className={className} />;
  return <FireflyMnemonicIcon className={className} />;
}
