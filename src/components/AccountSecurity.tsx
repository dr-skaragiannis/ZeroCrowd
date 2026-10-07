"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Download, KeyRound, LockKeyhole, ShieldAlert, ShieldCheck } from "lucide-react";
import { T, useLanguage } from "@/components/LanguageProvider";
import { useProgress } from "@/components/ProgressProvider";
import type { AccountRecoveryFile } from "@/lib/accountKey";

type FormMessage = { type: "error" | "success"; text: string };

function downloadRecoveryFile(file: AccountRecoveryFile) {
  const blob = new Blob([`${JSON.stringify(file, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `gamehack-${file.handle}-account-key.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

export default function AccountSecurity() {
  const { t } = useLanguage();
  const { player } = useProgress();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [keyBusy, setKeyBusy] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<FormMessage | null>(null);
  const [keyMessage, setKeyMessage] = useState<FormMessage | null>(null);

  const changePassword = async (event: FormEvent) => {
    event.preventDefault();
    setPasswordMessage(null);
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: t("The new passwords do not match.") });
      return;
    }
    setPasswordBusy(true);
    try {
      const response = await fetch("/api/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const result = await response.json();
      if (!response.ok) {
        setPasswordMessage({ type: "error", text: t(result.error || "Unable to change your password.") });
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage({ type: "success", text: t("Your password has been updated.") });
    } catch {
      setPasswordMessage({ type: "error", text: t("Connection error. Please try again.") });
    } finally { setPasswordBusy(false); }
  };

  const createRecoveryFile = async () => {
    if (keyBusy) return;
    if (!window.confirm(t("Create a new account key file? Any older key file will stop working."))) return;
    setKeyBusy(true);
    setKeyMessage(null);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "recovery-key" }),
      });
      const result = await response.json();
      if (!response.ok || !result.recoveryFile) {
        setKeyMessage({ type: "error", text: t(result.error || "Unable to create the account key file.") });
        return;
      }
      downloadRecoveryFile(result.recoveryFile as AccountRecoveryFile);
      setKeyMessage({ type: "success", text: t("A new account key file was downloaded. Keep it private; the previous file has been revoked.") });
    } catch {
      setKeyMessage({ type: "error", text: t("Connection error. Please try again.") });
    } finally { setKeyBusy(false); }
  };

  if (player.isGuest) {
    return <section className="panel overflow-hidden"><div className="flex items-start gap-3 p-5 md:p-6"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#38314d] text-violet"><ShieldCheck size={19} /></span><div className="flex-1"><h2 className="display-font text-[17px] font-bold"><T>Protect your progress.</T></h2><p className="mt-2 text-[11px] leading-relaxed text-[#98a8ad]"><T>Create an account to set a password and download an account-specific recovery key file.</T></p><Link href="/register" className="btn-primary mt-4"><T>Create an account</T><ArrowRight size={14} /></Link></div></div></section>;
  }

  return <section className="panel overflow-hidden"><div className="border-b border-[#303d38] bg-[#1b2923] p-5 md:p-6"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#34502f] text-lime"><ShieldCheck size={19} /></span><div><h2 className="display-font text-[18px] font-bold"><T>Password and recovery</T></h2><p className="mt-1 text-[11px] text-[#a1b2a7]"><T>Account security for</T> <strong className="text-[#e5eee5]">@{player.handle}</strong></p></div></div></div>
    <div className="grid gap-0 xl:grid-cols-2"><div className="p-5 md:p-6"><div className="flex items-center gap-2"><KeyRound size={15} className="text-violet" /><h3 className="text-[12px] font-bold"><T>Password-free sign-in file</T></h3></div><p className="mt-2 text-[11px] leading-relaxed text-[#96a6ad]"><T>The key file is tied to this account. Anyone with the file can sign in, so store it somewhere private. Creating a new one immediately revokes the old file.</T></p><div className="mt-4 flex items-start gap-2 rounded-lg border border-[#554b39] bg-[#2b2922] p-3 text-[10px] leading-relaxed text-[#e0c998]"><ShieldAlert size={14} className="mt-0.5 shrink-0" /><span><T>No email recovery is available yet. Keep your password and key file safe.</T></span></div><button type="button" onClick={() => void createRecoveryFile()} disabled={keyBusy} className="btn-secondary mt-4"><Download size={14} />{keyBusy ? t("Preparing file...") : t("Generate and download a new key file")}</button>{keyMessage && <div className={`${keyMessage.type === "error" ? "alert-error" : "alert-success"} mt-3`} role="status">{keyMessage.text}</div>}</div>
      <form className="border-t border-[#2f3940] p-5 md:p-6 xl:border-l xl:border-t-0" onSubmit={changePassword}><div className="flex items-center gap-2"><LockKeyhole size={15} className="text-lime" /><h3 className="text-[12px] font-bold"><T>Change password</T></h3></div><p className="mt-2 text-[11px] leading-relaxed text-[#96a6ad]"><T>Use your current password to set a new one. Your other active sessions will be signed out.</T></p><div className="mt-4 space-y-3"><label className="block"><span className="field-label">{t("Current password")}</span><input className="field" type="password" autoComplete="current-password" value={currentPassword} onChange={event => setCurrentPassword(event.target.value)} required /></label><label className="block"><span className="field-label">{t("New password")}</span><input className="field" type="password" autoComplete="new-password" minLength={8} maxLength={128} value={newPassword} onChange={event => setNewPassword(event.target.value)} required /></label><label className="block"><span className="field-label">{t("Confirm new password")}</span><input className="field" type="password" autoComplete="new-password" minLength={8} maxLength={128} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} required /></label></div>{passwordMessage && <div className={`${passwordMessage.type === "error" ? "alert-error" : "alert-success"} mt-4`} role="status">{passwordMessage.text}</div>}<button type="submit" disabled={passwordBusy} className="btn-primary mt-4"><LockKeyhole size={14} />{passwordBusy ? t("Updating...") : t("Update password")}</button></form></div>
  </section>;
}
