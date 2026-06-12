import { RegisterSteps } from "../page";
import FirstStepRegister from "./first-step";
import InvalidRegisterStep from "./invalid-step";
import SecondStep from "./second-step";

export default function StepsRegisteAgrupate({
  step,
}: {
  step: RegisterSteps;
}) {
  switch (Number(step)) {
    case 1:
      return <FirstStepRegister />;
    case 2:
      return <SecondStep />;
    default:
      return <InvalidRegisterStep />;
  }
}
