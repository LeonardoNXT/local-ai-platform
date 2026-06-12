import RegisterHeader from "./components/header";
import StepsRegisteAgrupate from "./components/steps-agrupate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastro - Cadastra-se para conhecer o completo novo.",
};

export type RegisterSteps = 1 | 2 | 3 | 4 | undefined;

type PageProps = {
  searchParams: Promise<{
    oauth: boolean;
    step: RegisterSteps;
  }>;
};

export default async function RegisterPage({ searchParams }: PageProps) {
  const { oauth, step } = await searchParams;

  return (
    <div className="w-full h-screen flex flex-col">
      <main className="w-full flex-1">
        <RegisterHeader step={step} />
        <StepsRegisteAgrupate step={step} />
      </main>
    </div>
  );
}
