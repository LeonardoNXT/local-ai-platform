import { useEffect, useState } from "react";
import { SpinnerCustom } from "./spinnerCustom";

export default function LoadingScreen() {
  const [warming, setWarming] = useState<boolean>(false);

  useEffect(() => {
    setTimeout(() => {
      setWarming(true);
    }, 4000);
  }, []);

  return (
    <div className="fixed flex-col gap-5 inset-0 z-9999 fade-out bg-black flex justify-center items-center pointer-events-none duration-75">
      <SpinnerCustom />

      <p
        className={`font-medium text-wave ${warming ? "" : "opacity-0"} duration-500`}
      >
        Pode estar demorando mais do que o normal...
      </p>
    </div>
  );
}
