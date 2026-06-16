import z from "zod";

export const LoginFormSchema = z.object({
  email: z.email({ error: "O campo deve ser preenchido com um email válido." }),
  password: z.string(),
});

export type LoginFormSchemaType = z.infer<typeof LoginFormSchema>;
