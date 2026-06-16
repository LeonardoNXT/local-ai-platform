"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UseMutationResult } from "@tanstack/react-query";

import { useRegister } from "@/hook/useRegister";
import { OAuthRegisterInput, RegisterInput } from "@/services/auth.service";
import {
  RegisterDeviceSchema,
  RegisterDeviceSchemaType,
} from "@/schema/register.schema";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import LoadingScreen from "@/components/loading-screen";
import { SpinnerCustom } from "@/components/spinnerCustom";

export default function ThirdStep() {
  const { firstFormContent, normalRegister, oauthIntent } = useRegister();
  const hasSubmittedRef = useRef(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  useEffect(() => {
    if (firstFormContent.name.length === 0) {
      setTimeout(() => {
        const params = new URLSearchParams(searchParams);
        params.set("step", "1");
        push(`${pathname + "?" + params.toString()}`);
      }, 3000);
    }
  }, [firstFormContent, pathname, push, searchParams]);

  useEffect(() => {
    if (hasSubmittedRef.current) return;

    if (
      firstFormContent.name.length !== 0 &&
      !oauthIntent.sub &&
      !normalRegister.isPending
    ) {
      hasSubmittedRef.current = true;
      normalRegister.mutate(firstFormContent);
    }
  }, []);

  if (firstFormContent.name.length === 0) {
    return <StepException />;
  }

  if (oauthIntent.sub) {
    return <RegisterDeviceName />;
  } else {
    return <CreatingNormalAccount />;
  }
}

function RegisterDeviceName() {
  const { device, firstFormContent, oauthRegister } = useRegister();
  const onceTime = useRef<boolean>(false);

  useEffect(() => {
    if (
      (firstFormContent.name.length !== 0 &&
        device.status !== "pending" &&
        device.data !== undefined,
      !onceTime.current)
    ) {
      oauthRegister.mutate({
        ...firstFormContent,
      });
      onceTime.current = true;
    }
  }, [device, firstFormContent, oauthRegister]);

  if (!device.data) {
    return (
      <DeviceForm
        firstFormContent={firstFormContent}
        oauthRegister={oauthRegister}
      />
    );
  } else {
    return <LoadingScreen />;
  }
}

function DeviceForm({
  firstFormContent,
  oauthRegister,
}: {
  firstFormContent: RegisterInput;
  oauthRegister: UseMutationResult<void, Error, OAuthRegisterInput, unknown>;
}) {
  const { control, handleSubmit } = useForm<RegisterDeviceSchemaType>({
    resolver: zodResolver(RegisterDeviceSchema),
    mode: "onSubmit",
    defaultValues: {
      deviceName: "",
    },
  });

  const onSubmit = (data?: RegisterDeviceSchemaType) => {
    oauthRegister.mutate({
      ...firstFormContent,
      deviceName: data?.deviceName,
    });
  };

  return (
    <section className="w-full h-screen flex justify-center fade-in">
      <div className="w-[30%] h-full flex flex-col justify-center">
        <h1 className="text-[25px]">
          Aqui você pode dar nome a este dispositivo
        </h1>
        <p className="text-[#bbb]">
          Considere dar nome a este novo dispositivo afim de facilitar o
          controle da sua conta.{" "}
          <span className="underline cursor-pointer text-white">
            Saiba mais
          </span>
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="deviceName"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="mt-2.5">
                <FieldLabel>Nome do dispostivo</FieldLabel>
                <Input
                  {...field}
                  id="form-deviceName-register"
                  type="text"
                  autoComplete="deviceName"
                  aria-invalid={fieldState.invalid}
                  placeholder="Nome do dispostivo..."
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Button type="submit" className="w-full mt-5 py-4.5">
            Concluir Cadastro
          </Button>
        </form>
        <Button
          type="submit"
          variant={"outline"}
          className="w-full mt-2.5 py-4.5"
        >
          Concluir Cadastro Sem Nomear o Dispositivo
        </Button>
      </div>
    </section>
  );
}

function CreatingNormalAccount() {
  const [warning, setWarning] = useState<boolean>(false);
  useEffect(() => {
    setTimeout(() => {
      setWarning(true);
    }, 4000);
  }, []);

  return (
    <div className="w-full h-full bg-black fixed top-0 left-0 flex justify-center items-center fade-in flex-col">
      <h1 className="text-[25px] text-wave">
        Estamos criando a sua conta. aguarde...
      </h1>
      <p
        className={`text-[16px] bg-[#333] text-wave mt-2.5 ${warning ? "" : "opacity-0"}`}
      >
        Pode estar demorando mais do que o normal.
      </p>
    </div>
  );
}

function StepException() {
  return (
    <div className="w-full h-screen flex justify-center flex-col items-center fade-in">
      <div className="pb-5">
        <SpinnerCustom />
      </div>
      <div className="text-center">
        <h1 className="text-[25px] text-wave">
          Está etapa ainda não pode ser realizada.
        </h1>
        <p className="text-[#bbb]">
          Você precisa concluir as etapas anteriores a esta para concluir o
          cadastro.
        </p>
      </div>
    </div>
  );
}
