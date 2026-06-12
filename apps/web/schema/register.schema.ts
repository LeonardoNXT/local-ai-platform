import z from "zod";
export const RegisterSchema = z.object({
  name: z.string().min(5, {
    error: "O nome deve conter pelo menos 5 caractéres.",
  }),

  username: z
    .string()
    .min(5, {
      error: "O nome deve conter pelo menos 5 caractéres.",
    })
    .max(20, {
      error: "O nome de usuário não pode conter mais de 20 caractéres.",
    }),

  email: z.email({
    error: "Digite um email válido.",
  }),

  password: z.string().min(8, {
    error: "A senha precisa conter pelo menos 8 digitos.",
  }),

  birthday: z.string(),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
