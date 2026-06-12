"use client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormSchema, LoginFormSchemaType } from "@/schema/login.schema";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useNormalLogin from "@/hook/login-form.mutation";
import { SpinnerCustom } from "@/components/spinnerCustom";
import { AuthService } from "@/services/auth.service";
import { useState } from "react";
import Link from "next/link";
import LoadingScreen from "@/components/loading-screen";

export default function LoginForm() {
  const form = useForm({
    mode: "onSubmit",
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [oauthselection, setOAuthSeletion] = useState<{
    type: string;
  } | null>(null);

  const { mutate, isPending } = useNormalLogin();

  function oauthHandler() {
    AuthService.oauthLogin();
    setOAuthSeletion({
      type: "Google",
    });
  }

  function onSubmit(data: LoginFormSchemaType) {
    mutate(data);
  }

  return (
    <>
      {oauthselection && <LoadingScreen />}
      <form
        className="w-full h-max flex flex-col gap-5"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit(onSubmit)(e);
        }}
      >
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Email</FieldLabel>
                <Input
                  {...field}
                  id="form-email-login"
                  type="email"
                  aria-invalid={fieldState.invalid}
                  placeholder="Email..."
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>

                <Input
                  {...field}
                  id="form-password-login"
                  type="password"
                  aria-invalid={fieldState.invalid}
                  placeholder="Senha..."
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <Field>
          <Button disabled={isPending} type="submit">
            {isPending ? <SpinnerCustom /> : "Entrar"}
          </Button>
          <Button variant="outline" type="button" onClick={oauthHandler}>
            Entrar com Google
          </Button>
          <FieldDescription className="text-center">
            Não tem uma conta? <Link href="/register?step=1">Cadastre-se</Link>
          </FieldDescription>
        </Field>
      </form>
    </>
  );
}
