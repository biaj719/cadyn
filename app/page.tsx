import { OnboardingGate } from "@/components/onboarding-gate";
import { CadynApp } from "@/components/syncup/syncup-app";

export default function Home() {
  return (
    <>
      <OnboardingGate />
      <CadynApp />
    </>
  );
}
