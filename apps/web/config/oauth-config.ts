import { OAuthButtonMethods } from "@/@types/oauth-types";
import { FaApple, FaDiscord, FaMicrosoft } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export const OauthMethods: OAuthButtonMethods[] = [
  {
    title: "Continuar com Google",
    redirect_url: "/api/oauth/google/register",
    icon: FcGoogle,
  },
  {
    title: "Continuar com Apple",
    redirect_url: "/api/oauth/register/method/apple",
    icon: FaApple,
  },
  {
    title: "Continuar com Microsoft",
    redirect_url: "api/oauth/register/method/microsoft",
    icon: FaMicrosoft,
  },
  {
    title: "Continuar com Discord",
    redirect_url: "/api/oauth/register/method/discord",
    icon: FaDiscord,
  },
];
