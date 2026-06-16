"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, RegisterSchemaType } from "@/schema/register.schema";
import { OAuthIntentPayload } from "@/services/auth.service";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import Image from "next/image";
import { useRegisterWizard } from "@/store/register-wizard.store";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function RegisterForm({
  oauthIntent,
}: {
  oauthIntent?: OAuthIntentPayload;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const { setStepOne } = useRegisterWizard();
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: oauthIntent?.name ?? "",
      email: oauthIntent?.email ?? "",
      birthday: "",
      password: "",
      username: "",
    },
    mode: "onSubmit",
  });

  const providerName = oauthIntent?.name
    ? oauthIntent.provider[0].toUpperCase() +
      oauthIntent.provider
        .split("")
        .filter((letter, i) => i !== 0)
        .join("")
    : "Desconhecido";

  const nextHandler = () => {
    const params = new URLSearchParams(searchParams);

    params.set("step", "3");

    push(`${pathname + "?" + params.toString()}`);
  };

  const submit = (input: RegisterSchemaType) => {
    setStepOne(input);
    nextHandler();
  };

  return (
    <div className="fade-in">
      <div className="pb-5">
        <h1 className="text-[30px]">Aqui continuamos com o seu cadastro!</h1>
        <span className="text-[16px] text-[#bbb]">
          preencha completamente as informações abaixo para continuar.
        </span>
      </div>
      {oauthIntent && (
        <div className="p-2.5 mb-2.5 border-[#222] border bg-[#111] rounded-[10px] flex flex-row-reverse justify-between items-center">
          <h2 className=" text-[14px] text-[#bbb] font-medium">
            {providerName}
          </h2>
          <div className="flex items-center gap-2.5">
            {oauthIntent.picture && (
              <Image
                src={oauthIntent.picture}
                alt="OAuth profile picture"
                className="rounded-full"
                width={25}
                height={25}
              />
            )}
            <span className="text-[16px] text-[#eee] font-light">
              {oauthIntent.name}
            </span>
          </div>
        </div>
      )}
      <form autoComplete="off" onSubmit={handleSubmit(submit)}>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="mt-2.5">
              <FieldLabel>Name</FieldLabel>
              <Input
                {...field}
                id="form-name-regiter"
                type="text"
                aria-invalid={fieldState.invalid}
                placeholder="Nome..."
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="mt-2.5">
              <FieldLabel>Email</FieldLabel>
              <Input
                {...field}
                disabled={Boolean(oauthIntent)}
                id="form-email-login"
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="Email..."
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="username"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="mt-2.5">
              <FieldLabel>Nome de usuário</FieldLabel>
              <Input
                {...field}
                id="form-username-register"
                type="text"
                autoComplete="username"
                aria-invalid={fieldState.invalid}
                placeholder="Nome do usuário..."
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="birthday"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="mt-2.5">
              <FieldLabel>Data de nascimento</FieldLabel>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-start text-left font-normal py-5"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />

                    {field.value ? (
                      format(new Date(field.value), "dd/MM/yyyy")
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) =>
                      field.onChange(date?.toISOString() ?? "")
                    }
                    captionLayout="dropdown"
                    disabled={(date) =>
                      date > new Date() || date < new Date("1926-01-01")
                    }
                  />
                </PopoverContent>
              </Popover>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="mt-2.5">
              <FieldLabel>Senha</FieldLabel>
              <Input
                {...field}
                id="form-password-register"
                type="password"
                autoComplete="new-password"
                aria-invalid={fieldState.invalid}
                placeholder="Senha..."
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button className="w-full mt-5 py-4.5" type="submit">
          Próxima etapa
          <ArrowRight />
        </Button>
      </form>
    </div>
  );
}
