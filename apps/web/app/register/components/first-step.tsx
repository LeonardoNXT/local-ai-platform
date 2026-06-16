"use client";
import { toast } from "sonner";
import OAuthMethods from "./oauth-methods";
import { useEffect, useRef } from "react";

export default function FirstStepRegister({ error }: { error?: string }) {
  const hasShowError = useRef<boolean>(false);
  useEffect(() => {
    if (error && !hasShowError.current) {
      toast.error(`Houve um erro no cadastro. Tente novamente. ${error}`, {
        position: "top-center",
      });

      hasShowError.current = true;
    }
  }, [error]);

  return (
    <section className="w-full h-full flex justify-center fade-in">
      <div className="p-10  lg:p-0 w-full lg:w-[30%] h-full flex items-center">
        <div className="w-full">
          <span className="text-[#888] font-medium">Cadastro</span>
          <h1 className="text-[25px] font-medium mb-2.5">
            Olá, você parece novo por aqui. Gostaria de começar o seu cadastro
            vinculando a alguma conta?
          </h1>
          <OAuthMethods />
        </div>
      </div>
    </section>
  );
}
