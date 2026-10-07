import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AuthFrame from "@/components/AuthFrame";
import LoginForm from "@/components/LoginForm";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Sign in", description: "Sign in to continue your Gamehack training." };
export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const account = await getCurrentUser();
  if (account && !account.isGuest) redirect("/dashboard");
  return <AuthFrame mode="login"><LoginForm /></AuthFrame>;
}
