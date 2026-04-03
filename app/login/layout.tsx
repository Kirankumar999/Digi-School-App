import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - DigiSchool",
  description: "Sign in to your DigiSchool account",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
