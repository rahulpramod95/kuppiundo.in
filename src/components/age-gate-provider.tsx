"use client";

import { useEffect, useState, type ReactNode } from "react";
import { isAgeVerified } from "@/lib/age-gate";
import { AgeGateSheet } from "@/components/age-gate-sheet";
import { StatutoryWarningOverlay } from "@/components/statutory-warning-overlay";

type AgeGateProviderProps = {
  children: ReactNode;
};

type GatePhase = "loading" | "age_gate" | "statutory" | "ready";

export function AgeGateProvider({ children }: AgeGateProviderProps) {
  const [phase, setPhase] = useState<GatePhase>("loading");

  useEffect(() => {
    setPhase(isAgeVerified() ? "statutory" : "age_gate");
  }, []);

  const showApp = phase === "statutory" || phase === "ready";
  const showAgeGate = phase === "age_gate";
  const showStatutory = phase === "statutory";

  return (
    <>
      {showApp ? children : null}
      <AgeGateSheet
        open={showAgeGate}
        onVerified={() => setPhase("statutory")}
      />
      <StatutoryWarningOverlay
        open={showStatutory}
        onDismissed={() => setPhase("ready")}
      />
    </>
  );
}
