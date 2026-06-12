"use client";

import LoadingScreen from "@/components/loading-screen";
import { AuthService } from "@/services/auth.service";
import { useQuery } from "@tanstack/react-query";

import RegisterForm from "./register-form";

export default function SecondStep() {
  const { data, isPending } = useQuery({
    queryKey: ["oauthintent"],
    queryFn: AuthService.getOauthIntent,
    retry: 0,
  });

  return (
    <section className="w-full h-full flex items-center justify-center">
      <div className=""></div>
      {isPending && <LoadingScreen />}
      {!isPending && (
        <div className="w-full p-10 lg:p-0 lg:w-[30%]">
          <RegisterForm oauthIntent={data} />
        </div>
      )}
    </section>
  );
}
