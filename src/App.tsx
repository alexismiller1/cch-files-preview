import "./utils/IMS";
import { useState } from "react";
import { Provider } from "@react-spectrum/s2";
import { style } from "@react-spectrum/s2/style" with { type: "macro" };
import { IMSProvider } from "./contexts/IMSProvider";
import { Agentation } from "agentation";
import StarterPage from "./_starter/StarterPage";
import { layouts } from "./_starter/layouts/registry";

function PreviewPage({
  layoutId,
  initialTheme,
}: {
  layoutId: string;
  initialTheme: "light" | "dark";
}) {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">(initialTheme);
  const toggleColorScheme = () =>
    setColorScheme((prev) => (prev === "dark" ? "light" : "dark"));

  const layout = layouts.find((l) => l.id === layoutId);
  const PreviewComponent = layout?.preview;

  if (!PreviewComponent) {
    return (
      <Provider colorScheme={colorScheme}>
        <div
          className={style({ backgroundColor: "pasteboard" })}
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <p>Preview not found</p>
        </div>
      </Provider>
    );
  }

  return (
    <Provider colorScheme={colorScheme}>
      <div
        className={style({ backgroundColor: "pasteboard" })}
        style={{ width: "100vw", height: "100vh" }}
      >
        <PreviewComponent onToggleTheme={toggleColorScheme} />
      </div>
    </Provider>
  );
}

function App() {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("dark");
  const toggleColorScheme = () =>
    setColorScheme((prev) => (prev === "dark" ? "light" : "dark"));

  const params = new URLSearchParams(window.location.search);
  const previewId = params.get("preview");

  if (previewId) {
    const theme = params.get("theme") === "light" ? "light" : "dark";
    return <PreviewPage layoutId={previewId} initialTheme={theme} />;
  }

  return (
    <Provider colorScheme={colorScheme}>
      <IMSProvider>
        <StarterPage onToggleTheme={toggleColorScheme} />
      </IMSProvider>
      {import.meta.env.DEV && <Agentation />}
    </Provider>
  );
}

export default App;
