import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from '@react-spectrum/s2'
import './index.css'
import './utils/IMS'
import { IMSProvider } from './contexts/IMSProvider'
import App from './App.tsx'
import StarterPage from './_starter/StarterPage.tsx'
import { DevToolbar } from './_starter/components/DevToolbar'
import { useColorScheme } from './hooks/useColorScheme'

const params = new URLSearchParams(window.location.search);
const shouldShowPicker = params.has("picker");

function PickerApp() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Provider colorScheme={colorScheme}>
      <IMSProvider>
        <StarterPage onToggleTheme={toggleColorScheme} />
      </IMSProvider>
      {import.meta.env.DEV && <DevToolbar />}
    </Provider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {shouldShowPicker ? <PickerApp /> : <App />}
  </StrictMode>,
)
