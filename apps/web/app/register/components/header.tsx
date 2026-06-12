import Image from "next/image";
import { RegisterSteps } from "../page";

export default function RegisterHeader({ step }: { step: RegisterSteps }) {
  return (
    <header className="w-full p-5 fixed flex justify-between items-center">
      <Image src={"/logo-teste.png"} alt="logo" width={50} height={50} />
      <div className="p-2 rounded-full  border-[#8a8a8a] text-[#777] tracking-widest text-[13px]">
        {step ? step : 1}/3
      </div>
    </header>
  );
}
