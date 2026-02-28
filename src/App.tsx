import "./utils/IMS";
import { useState } from "react";
import { Provider } from "@react-spectrum/s2";
import { IMSProvider } from "./contexts/IMSProvider";
import { Agentation } from "agentation";
import StarterPage from "./_starter/StarterPage";

function App() {
  const [colorScheme, setColorScheme] = useState<"light" | "dark">("dark");
  const toggleColorScheme = () =>
    setColorScheme((prev) => (prev === "dark" ? "light" : "dark"));

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
