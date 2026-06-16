"use client";

import OAuthButton from "@/components/oauth-button";
import { Button } from "@/components/ui/button";
import { OauthMethods } from "@/config/oauth-config";
import { ArrowRight } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function OAuthMethods() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  const maybeLaterHandler = () => {
    const params = new URLSearchParams(searchParams);

    params.set("step", "2");

    push(`${pathname + "?" + params.toString()}`);
  };

  return (
    <>
      {OauthMethods.map((method, i) => (
        <OAuthButton
          key={i}
          icon={method.icon}
          redirect_url={method.redirect_url}
          title={method.title}
        />
      ))}
      <Button
        className="w-full mt-5 h-11 rounded-full gap-2 border-[#333"
        onClick={() => maybeLaterHandler()}
      >
        <span>Talvez mais tarde</span>
        <ArrowRight />
      </Button>
    </>
  );
}
