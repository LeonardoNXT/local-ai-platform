import { AuthService } from "@/services/auth.service";
import { useOAuthIntentStore } from "@/store/oauth-intent.store";
import { useRegisterWizard } from "@/store/register-wizard.store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export function useRegister() {
  const { resetWizard, stepOne } = useRegisterWizard();
  const { oauthIntent } = useOAuthIntentStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const params = new URLSearchParams(searchParams);

  const device = useQuery({
    queryKey: ["device"],
    queryFn: AuthService.getDevice,
    retry: 0,
  });

  const oauthRegister = useMutation({
    onError: (error) => {
      toast.error(`Houve um erro ao cadatrar a sua conta. ${error.message}`, {
        position: "top-center",
      });
      resetWizard();
      params.set("step", "1");
      params.set("error", error.message);
      push(`${pathname + "?" + params.toString()}`);
    },
    onSuccess: () => {
      params.set("register", "success");
      push(`/`);
      resetWizard();
    },
    mutationFn: AuthService.oauthRegister,
    retry: 0,
  });

  const normalRegister = useMutation({
    onError: (error) => {
      console.log("passou por aqui.");
      resetWizard();
      params.set("step", "1");
      params.set("error", error.message);
      push(`${pathname + "?" + params.toString()}`);
    },
    onSuccess: () => {
      params.set("register", "success");
      push(`${"/login" + "?" + params.toString()}`);
      resetWizard();
    },
    mutationFn: AuthService.register,
    retry: 0,
  });

  return {
    device,
    oauthRegister,
    normalRegister,
    firstFormContent: stepOne,
    oauthIntent,
  };
}
