import Image from "next/image";
import type { Metadata } from "next";
import LoginForm from "./components/login-form";
import LoginErrorToast from "./components/login-error-toast";

export const metadata: Metadata = {
  title: "Login - Logue-se e conheça o extraordinário",
};

type PageProps = {
  searchParams: Promise<{
    error?: string;
    code?: string;
    type?: string;
  }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const { error, type } = await searchParams;

  console.log(error, type);

  return (
    <>
      <LoginErrorToast error={error} type={type} />
      <main className="w-full flex h-screen fade-in">
        <section className="w-full lg:w-[30%] flex flex-col h-full lg:border-r border-[#333]">
          <header className="p-5 w-full justify-between flex items-center absolute">
            <Image src={"/logo-teste.png"} alt="logo" width={50} height={50} />
          </header>
          <div className="px-10 lg:px-20 flex flex-col w-full h-full justify-center">
            <h1 className="text-4xl font-semibold mb-10">
              Olá!
              <br /> Bem vindo de volta.
            </h1>
            <LoginForm />
          </div>
        </section>
        <section className="w-[70%] h-full relative hidden lg:block overflow-hidden">
          <Image
            className="w-full h-full border-0 object-cover brightness-50 sepia-50 scale-effect"
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
