import { AuthService, LoginPayload } from "@/services/auth.service";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function useNormalLogin() {
  return useMutation({
    mutationFn: (input: LoginPayload) => AuthService.login(input),
    onSuccess: () => {
      toast.success("Bem vindo de novo!", {
        position: "top-center",
      });
    },
    onError: (error) => {
      toast.error(`Houve um erro ao logar. ${error.message}`, {
        position: "top-center",
      });
    },
  });
}
