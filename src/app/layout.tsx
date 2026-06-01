import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kuppiundo · Kerala bottle finder",
  description:
    "Find the right bottle based on taste, budget, and occasion with Kerala retail prices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
