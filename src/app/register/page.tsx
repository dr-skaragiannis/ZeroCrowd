import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthFrame from "@/components/AuthFrame";
import RegisterForm from "@/components/RegisterForm";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Create your account", description: "Join Gamehack's safe, hands-on cybersecurity training range." };
export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const account = await getCurrentUser();
  if (account && !account.isGuest) redirect("/dashboard");
  return <AuthFrame mode="register"><RegisterForm /></AuthFrame>;
}
