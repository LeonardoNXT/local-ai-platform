import { OAuthIntent } from "@/@types/oauth-types";
import { create } from "zustand";

const initialState: OAuthIntent = {
  email: "",
  email_verified: false,
  provider: "",
  sub: "",
  name: "",
  picture: "",
};

interface OAuthIntentStore {
  oauthIntent: OAuthIntent;
  setOAuthIntent: (data: OAuthIntent) => void;
  resetOAuthIntentStore: () => void;
}

export const useOAuthIntentStore = create<OAuthIntentStore>((set) => ({
  oauthIntent: initialState,
  setOAuthIntent: (data: OAuthIntent) => {
    set((state) => ({
      oauthIntent: {
        ...state.oauthIntent,
        ...data,
      },
    }));
  },

  resetOAuthIntentStore: () => {
    set(() => ({
      oauthIntent: initialState,
    }));
  },
}));
