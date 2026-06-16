import { create } from "zustand";

type FirstStepData = {
  name: string;
  username: string;
  email: string;
  password: string;
  birthday: string;
};

type RegisterWizardState = {
  stepOne: FirstStepData;

  setStepOne: (data: Partial<FirstStepData>) => void;

  resetWizard: () => void;
};

const initialState = {
  stepOne: {
    name: "",
    username: "",
    email: "",
    password: "",
    birthday: "",
  },
  device: {
    deviceName: undefined,
  },
};

export const useRegisterWizard = create<RegisterWizardState>()((set) => ({
  ...initialState,

  setStepOne: (data) => {
    set((state) => ({
      stepOne: {
        ...state.stepOne,
        ...data,
      },
    }));
  },

  resetWizard: () => {
    set(initialState);
  },
}));
