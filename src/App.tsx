import { useState, useEffect } from "react";
import { Provider } from "@react-spectrum/s2";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SelectedAppProvider } from "./context/SelectedAppContext";
import { DisplayConfigProvider } from "./context/DisplayConfigContext";
import { DesktopView } from "./pages/DesktopView";

const THEME_STORAGE_KEY = "app-theme";

function readStoredTheme(): "light" | "dark" {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* ignore */
  }
  return "light";
}

function App() {
  const [theme, setTheme] = useState<"light" | "dark">(readStoredTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.setAttribute("data-color-scheme", theme);
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  useEffect(() => {
    const SCROLLBAR_HIDE_DELAY_MS = 750;
    const NEAR_THRESHOLD_PX = 28;
    const hideTimeouts = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>();
    const nearTimeouts = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>();
    let lastMouse = { x: 0, y: 0 };

    const isScrollable = (el: HTMLElement) => {
      const s = getComputedStyle(el);
      const o = s.overflow;
      const ox = s.overflowX;
      const oy = s.overflowY;
      return o === "auto" || o === "scroll" || ox === "auto" || ox === "scroll" || oy === "auto" || oy === "scroll";
    };

    const updateNear = () => {
      const { x: mx, y: my } = lastMouse;
      const under = document.elementsFromPoint(mx, my);
      const toShow = new Set<HTMLElement>();
      for (let n: Element | null = under[0]; n; n = n.parentElement) {
        const el = n as HTMLElement;
        if (!isScrollable(el)) continue;
        const rect = el.getBoundingClientRect();
        const hasV = el.scrollHeight > el.clientHeight;
        const hasH = el.scrollWidth > el.clientWidth;
        const nearRight = hasV && mx >= rect.right - NEAR_THRESHOLD_PX && mx <= rect.right + 4 && my >= rect.top && my <= rect.bottom;
        const nearBottom = hasH && my >= rect.bottom - NEAR_THRESHOLD_PX && my <= rect.bottom + 4 && mx >= rect.left && mx <= rect.right;
        if (nearRight || nearBottom) toShow.add(el);
      }
      document.querySelectorAll<HTMLElement>(".scrollbar-near").forEach((el) => {
        if (toShow.has(el)) return;
        const t = nearTimeouts.get(el);
        if (t) clearTimeout(t);
        nearTimeouts.set(
          el,
          setTimeout(() => {
            el.classList.remove("scrollbar-near");
            nearTimeouts.delete(el);
          }, 120),
        );
      });
      toShow.forEach((el) => {
        el.classList.add("scrollbar-near");
        const t = nearTimeouts.get(el);
        if (t) clearTimeout(t);
        nearTimeouts.delete(el);
      });
    };

    let rafId = 0;
    const handleMouseMove = (e: MouseEvent) => {
      lastMouse = { x: e.clientX, y: e.clientY };
      if (!rafId) rafId = requestAnimationFrame(() => { rafId = 0; updateNear(); });
    };

    const handleScroll = (e: Event) => {
      const el = e.target as HTMLElement;
      if (!el?.classList) return;
      el.classList.add("scrollbar-visible");
      const existing = hideTimeouts.get(el);
      if (existing) clearTimeout(existing);
      hideTimeouts.set(
        el,
        setTimeout(() => {
          el.classList.remove("scrollbar-visible");
          hideTimeouts.delete(el);
        }, SCROLLBAR_HIDE_DELAY_MS),
      );
    };

    document.addEventListener("scroll", handleScroll, true);
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      document.removeEventListener("scroll", handleScroll, true);
      document.removeEventListener("mousemove", handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <Provider colorScheme={theme} UNSAFE_style={{ height: "100%", minHeight: "100%" }}>
      <BrowserRouter>
        <Routes>
          <Route
            path="/*"
            element={
              <DisplayConfigProvider>
                <SelectedAppProvider>
                  <DesktopView theme={theme} setTheme={setTheme} />
                </SelectedAppProvider>
              </DisplayConfigProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
