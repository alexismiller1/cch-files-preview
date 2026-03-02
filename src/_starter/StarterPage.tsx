import { ToastContainer } from "@react-spectrum/s2";
import { LayoutPicker } from "./components/LayoutPicker";

interface StarterPageProps {
  onToggleTheme: () => void;
}

export default function StarterPage({ onToggleTheme }: StarterPageProps) {
  return (
    <>
      <LayoutPicker onToggleTheme={onToggleTheme} />
      <ToastContainer />
    </>
  );
}
