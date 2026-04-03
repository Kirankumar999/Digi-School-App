import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account - DigiSchool",
  description: "Create your DigiSchool account",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
