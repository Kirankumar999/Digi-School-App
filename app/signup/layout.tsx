import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Account - PradnyaShala",
  description: "Create your PradnyaShala account",
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
