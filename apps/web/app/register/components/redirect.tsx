"use client";

import { useRouter } from "next/navigation";

export default function RedirectRegister() {
  const router = useRouter();

  setTimeout(() => {
    router.push("?step=1");
  }, 2000);

  return <></>;
}
