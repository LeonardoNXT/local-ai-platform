import RedirectRegister from "./redirect";

export default function InvalidRegisterStep() {
  return (
    <section className="w-full h-screen flex justify-center">
      <RedirectRegister />
      <div className="w-full p-10 lg:p-0 lg:w-[30%] h-full flex items-center fade-in">
        <div>
          <p className="font-medium text-[25px]">
            Parece que a etapa que você está é invalida...
          </p>
          <span className="text-[#bbb]">
            Gostaria de começar a primeira etapa do seu cadastro? Vamos
            tranferir você para o lugar certo!
          </span>
          <div className="w-full flex">
            <div className="origin-bottom relative expand-width h-1 rounded-full bg-white mt-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
