"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function OnboardingGate() {
  const router = useRouter();
  useEffect(() => {
    const ONBOARDING_VERSION = "v2";
    const complete = localStorage.getItem("cadyn_onboarding_complete");
    const version = localStorage.getItem("cadyn_onboarding_version");
    if (!complete || version !== ONBOARDING_VERSION) {
      router.replace("/onboarding");
    }
  }, []);
  return null;
}
