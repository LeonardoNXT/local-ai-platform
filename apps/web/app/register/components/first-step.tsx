import OAuthMethods from "./oauth-methods";

export default function FirstStepRegister() {
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
