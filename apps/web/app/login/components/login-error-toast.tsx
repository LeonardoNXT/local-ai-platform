"use client";

import { useEffect } from "react";
import { toast } from "sonner";

type LoginErrorToastProps = {
  error?: string;
  type?: string;
};

export default function LoginErrorToast({ error, type }: LoginErrorToastProps) {
  useEffect(() => {
    if (!error) return;

    toast.error(
      `Houve um erro ao logar com ${type ?? "OAuth"}. Tente novamente.`,
      {
        position: "top-center",
      },
    );
  }, [error, type]);

  return null;
}
