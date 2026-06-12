"use client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema } from "@/schema/register.schema";
import { OAuthIntentPayload } from "@/services/auth.service";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import Image from "next/image";

export default function RegisterForm({
  oauthIntent,
}: {
  oauthIntent?: OAuthIntentPayload;
}) {
  const { control } = useForm({
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

  return (
    <div className="fade-in">
      {oauthIntent && (
        <div className="p-2.5 mb-5 bg-[#111] rounded-3xl border border-[#222] flex gap-2.5">
          {oauthIntent.picture && (
            <Image
              src={oauthIntent.picture}
              alt="OAuth profile picture"
              className="rounded-full"
              width={30}
              height={30}
            />
          )}
          <span>
            Parece que voce tentou logar utlizando {oauthIntent.provider}
          </span>
        </div>
      )}
      <form autoComplete="off">
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="mt-2.5">
              <FieldLabel>Name</FieldLabel>
              <Input
                {...field}
                id="form-name-regiter"
                type="email"
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
                    className="justify-start text-left font-normal py-5 "
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
      </form>
    </div>
  );
}
