import Image from "next/image";
import type { Metadata } from "next";
import LoginForm from "./components/login-form";

export const metadata: Metadata = {
  title: "Login - Logue-se e conheça o extraordinário",
};

export default function LoginPage() {
  return (
    <>
      <main className="w-full flex h-screen">
        <section className="w-[30%] flex flex-col h-full border-r border-[#333]">
          <header className="p-5 w-full justify-between flex items-center absolute">
            <Image
              src={"/logo.png"}
              alt="logo"
              width={30}
              height={30}
              className="invert-100"
            />
          </header>
          <div className="px-20 flex flex-col w-full h-full justify-center">
            <h1 className="text-4xl font-semibold mb-10">
              Olá!
              <br /> Bem vindo de volta.
            </h1>
            <LoginForm />
          </div>
        </section>
        <section className="w-[70%] h-full relative">
          <Image
            className="w-full h-full border-0 object-cover brightness-50 sepia-50"
            src={"/background-login.jpg"}
            width={3840}
            height={2160}
            loading="eager"
            alt="background"
          />
        </section>
      </main>
    </>
  );
}
