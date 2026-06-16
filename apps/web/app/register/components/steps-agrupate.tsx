import { RegisterSteps } from "../page";
import FirstStepRegister from "./first-step";
import InvalidRegisterStep from "./invalid-step";
import SecondStep from "./second-step";
import ThirdStep from "./third-step";

export default function StepsRegisteAgrupate({
  step,
  error,
}: {
  step: RegisterSteps;
  error?: string;
}) {
  switch (Number(step)) {
    case 1:
      return <FirstStepRegister error={error} />;
    case 2:
      return <SecondStep />;
    case 3:
      return <ThirdStep />;
    default:
      return <InvalidRegisterStep />;
  }
}
