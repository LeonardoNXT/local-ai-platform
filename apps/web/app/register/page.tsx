import RegisterHeader from "./components/header";
import StepsRegisteAgrupate from "./components/steps-agrupate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cadastro - Cadastra-se para conhecer o completo novo.",
};

export type RegisterSteps = 1 | 2 | 3 | 4 | undefined;

type PageProps = {
  searchParams: Promise<{
    step: RegisterSteps;
    error?: string;
  }>;
};

export default async function RegisterPage({ searchParams }: PageProps) {
  const { step, error } = await searchParams;

  return (
    <div className="w-full h-screen flex flex-col">
      <main className="w-full flex-1">
        <RegisterHeader step={step} />
        <StepsRegisteAgrupate step={step} error={error} />
      </main>
    </div>
  );
}
