"use client";

import { OAuthButtonMethods } from "@/@types/oauth-types";
import { Button } from "./ui/button";
import LoadingScreen from "./loading-screen";
import { useState } from "react";

export default function OAuthButton(payload: OAuthButtonMethods) {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  return (
    <>
      {isClicked && <LoadingScreen />}
      <Button
        variant={"outline"}
        onClick={() => {
          setIsClicked(true);
          window.location.href = payload.redirect_url;
        }}
        className="w-full mt-2.5 h-11 rounded-full gap-2 border-[#333] bg-black text-white"
      >
        <payload.icon />
        {payload.title}
      </Button>
    </>
  );
}
