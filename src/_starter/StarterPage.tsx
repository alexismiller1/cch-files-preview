import { UNSTABLE_ToastContainer as ToastContainer } from "@react-spectrum/s2";
import { LayoutPicker } from "./components/LayoutPicker";

export default function StarterPage() {
  return (
    <>
      <LayoutPicker />
      <ToastContainer />
    </>
  );
}
