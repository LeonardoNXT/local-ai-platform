"use client";

import LoadingScreen from "@/components/loading-screen";
import { AuthService } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";

import RegisterForm from "./register-form";
import { useEffect } from "react";
import { useOAuthIntentStore } from "@/store/oauth-intent.store";

export default function SecondStep() {
  const { data, isPending } = useQuery({
    queryKey: ["oauthintent"],
    queryFn: AuthService.getOauthIntent,
    retry: 0,
  });

  const { setOAuthIntent } = useOAuthIntentStore();

  useEffect(() => {
    if (!isPending && data) {
      setOAuthIntent(data);
    }
  }, [setOAuthIntent, data, isPending]);

  return (
    <section className="w-full h-full flex items-center justify-center">
      {isPending && <LoadingScreen />}
      {!isPending && (
        <div className="w-full p-10 lg:p-0 lg:w-[30%]">
          <RegisterForm oauthIntent={data} />
        </div>
      )}
    </section>
  );
}
