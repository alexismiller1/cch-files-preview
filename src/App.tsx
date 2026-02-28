import "./utils/IMS";
import { Provider } from "@react-spectrum/s2";
import { IMSProvider } from "./contexts/IMSProvider";
import StarterPage from "./_starter/StarterPage";

function App() {
  return (
    <Provider>
      <IMSProvider>
        <StarterPage />
      </IMSProvider>
    </Provider>
  );
}

export default App;
