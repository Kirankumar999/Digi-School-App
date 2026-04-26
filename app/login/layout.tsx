import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In - PradnyaShala",
  description: "Sign in to your PradnyaShala account",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
