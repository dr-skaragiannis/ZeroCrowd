"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Download, KeyRound, LoaderCircle, LockKeyhole, ShieldAlert, UserRound } from "lucide-react";
import { T, useLanguage } from "@/components/LanguageProvider";
import type { AccountRecoveryFile } from "@/lib/accountKey";

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

export default function RegisterForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [recoveryFile, setRecoveryFile] = useState<AccountRecoveryFile | null>(null);
  const [downloaded, setDownloaded] = useState(false);

  const saveRecoveryFile = () => {
    if (!recoveryFile) return;
    downloadRecoveryFile(recoveryFile);
    setDownloaded(true);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError(t("The passwords do not match."));
      return;
    }
    setBusy(true);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", displayName, password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(t(result.error || "Unable to create your account."));
        return;
      }
      const file = result.recoveryFile as AccountRecoveryFile;
      setRecoveryFile(file);
      try {
        downloadRecoveryFile(file);
        setDownloaded(true);
      } catch {
        setDownloaded(false);
      }
    } catch {
      setError(t("Connection error. Please try again."));
    } finally { setBusy(false); }
  };

  if (recoveryFile) {
    return <div className="auth-success-state"><span className="auth-success-icon"><Check size={23} /></span><div className="landing-section-eyebrow"><T en="ACCOUNT CREATED" el="Ο ΛΟΓΑΡΙΑΣΜΟΣ ΔΗΜΙΟΥΡΓΗΘΗΚΕ" /></div><h1 className="auth-form-title"><T en="Welcome to the range." el="Καλώς ήρθες στο cyber range." /></h1><p className="auth-form-description"><T en="You're signed in as" el="Έχεις συνδεθεί ως" /> <strong>@{recoveryFile.handle}</strong>. <T en="Your private account key is ready." el="Το ιδιωτικό κλειδί λογαριασμού είναι έτοιμο." /></p><div className="auth-key-file-card"><span className="auth-key-file-icon"><KeyRound size={17} /></span><div className="min-w-0 flex-1"><strong>gamehack-{recoveryFile.handle}-account-key.json</strong><small><T en="Your password-free sign-in key" el="Κλειδί σύνδεσης χωρίς κωδικό" /></small></div><Check size={16} className={downloaded ? "text-lime" : "text-[#77868b]"} /></div><div className="auth-key-warning"><ShieldAlert size={15} /><p><strong><T en="Keep this file private." el="Κράτησε αυτό το αρχείο ιδιωτικό." /></strong> <T en="Anyone who has it can access your account. Download it now and store it somewhere safe. It is the only password-free recovery method available." el="Όποιος το έχει μπορεί να αποκτήσει πρόσβαση στον λογαριασμό σου. Κατέβασέ το τώρα και φύλαξέ το με ασφάλεια. Είναι ο μόνος διαθέσιμος τρόπος ανάκτησης χωρίς κωδικό." /></p></div><button type="button" onClick={saveRecoveryFile} className="btn-secondary mt-4 w-full"><Download size={15} /><T en={downloaded ? "Download the key file again" : "Download your account key file"} el={downloaded ? "Κατέβασε ξανά το αρχείο κλειδιού" : "Κατέβασε το αρχείο κλειδιού"} /></button><button type="button" onClick={() => router.replace("/dashboard")} className="btn-primary mt-3 w-full"><T en="Continue to Dashboard" el="Συνέχεια στον Πίνακα Ελέγχου" /><ArrowRight size={14} /></button><p className="auth-form-footnote"><T en="You can download a replacement any time from your profile. Replacing it revokes this file." el="Μπορείς να κατεβάσεις νέο αρχείο από το προφίλ σου. Η αντικατάσταση ακυρώνει το παλιό." /></p></div>;
  }

  return <><div className="auth-form-eyebrow"><UserRound size={13} /><T en="CREATE AN OPERATOR ACCOUNT" el="ΔΗΜΙΟΥΡΓΙΑ ΛΟΓΑΡΙΑΣΜΟΥ OPERATOR" /></div><h1 className="auth-form-title"><T en="Join the range." el="Γίνε μέλος του range." /></h1><p className="auth-form-description"><T en="Your missions, labs, and progress—all in one place." el="Οι αποστολές, τα labs και η πρόοδός σου—όλα σε ένα μέρος." /></p><form className="auth-form" onSubmit={submit}><label className="block"><span className="field-label"><T en="Display name" el="Όνομα εμφάνισης" /></span><input className="field" type="text" autoComplete="name" minLength={2} maxLength={60} value={displayName} onChange={event => setDisplayName(event.target.value)} placeholder={t("How should we call you?")} required /></label><label className="block"><span className="field-label"><T en="Password" el="Κωδικός πρόσβασης" /></span><input className="field" type="password" autoComplete="new-password" minLength={8} maxLength={128} value={password} onChange={event => setPassword(event.target.value)} placeholder={t("At least 8 characters")} required /><small className="auth-field-hint"><T en="Use at least 8 characters." el="Χρησιμοποίησε τουλάχιστον 8 χαρακτήρες." /></small></label><label className="block"><span className="field-label"><T en="Confirm password" el="Επιβεβαίωση κωδικού" /></span><input className="field" type="password" autoComplete="new-password" minLength={8} maxLength={128} value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} placeholder={t("Enter your password again")} required /></label>{error && <div className="alert-error" role="alert">{error}</div>}<div className="auth-inline-note"><KeyRound size={14} /><span><T en="A private account key file will be generated for password-free recovery." el="Θα δημιουργηθεί ένα ιδιωτικό αρχείο κλειδιού για ανάκτηση χωρίς κωδικό." /></span></div><button type="submit" disabled={busy} className="btn-primary w-full">{busy ? <><LoaderCircle size={15} className="animate-spin" /><T en="Creating your account..." el="Δημιουργία λογαριασμού..." /></> : <><T en="Create account" el="Δημιουργία λογαριασμού" /><ArrowRight size={14} /></>}</button></form><p className="auth-switch"><T en="Already have an account?" el="Έχεις ήδη λογαριασμό;" /> <Link href="/login"><T en="Sign in" el="Σύνδεση" /></Link></p><div className="auth-privacy"><LockKeyhole size={12} /><T en="No email collected. Your handle is your account identity." el="Δεν συλλέγουμε email. Το όνομα χρήστη είναι η ταυτότητα του λογαριασμού." /></div></>;
}
