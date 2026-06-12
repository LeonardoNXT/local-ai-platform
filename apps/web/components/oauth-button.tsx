"use client";

import { OAuthButtonMethods } from "@/@types/oauth-types";
import { Button } from "./ui/button";

export default function OAuthButton(payload: OAuthButtonMethods) {
  return (
    <Button
      variant={"outline"}
      onClick={() => {
        window.location.href = payload.redirect_url;
      }}
      className="w-full mt-2.5 h-11 rounded-full gap-2 border-[#333] bg-black text-white"
    >
      <payload.icon />
      {payload.title}
    </Button>
  );
}
