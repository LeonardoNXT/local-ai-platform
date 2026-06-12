import { SpinnerCustom } from "./spinnerCustom";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-9999 fade-out bg-black flex justify-center items-center pointer-events-none duration-75">
      <SpinnerCustom />
    </div>
  );
}
