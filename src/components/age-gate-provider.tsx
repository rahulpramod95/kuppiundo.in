"use client";

import { useEffect, useState, type ReactNode } from "react";
import { isAgeVerified } from "@/lib/age-gate";
import { AgeGateSheet } from "@/components/age-gate-sheet";

type AgeGateProviderProps = {
  children: ReactNode;
};

export function AgeGateProvider({ children }: AgeGateProviderProps) {
  const [ready, setReady] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    setVerified(isAgeVerified());
    setReady(true);
  }, []);

  const blocked = ready && !verified;

  return (
    <>
      {verified ? children : null}
      <AgeGateSheet open={blocked} onVerified={() => setVerified(true)} />
    </>
  );
}
