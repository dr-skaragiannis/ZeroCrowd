"use client";

import { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, FileKey2, KeyRound, LoaderCircle, LockKeyhole, Upload, UserRound } from "lucide-react";
import { T, useLanguage } from "@/components/LanguageProvider";

type LoginMode = "password" | "key";

export default function LoginForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const [mode, setMode] = useState<LoginMode>("password");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [fileName, setFileName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const switchMode = (next: LoginMode) => { setMode(next); setError(""); };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      let body: Record<string, string>;
      if (mode === "password") {
        body = { action: "login", identifier, password };
      } else {
        const file = fileInput.current?.files?.[0];
        if (!file) { setError(t("Choose your Gamehack account key file.")); return; }
        if (file.size > 8_192) { setError(t("That file is too large to be a Gamehack account key.")); return; }
        body = { action: "key-login", keyFile: await file.text() };
      }
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(t(result.error || "Unable to sign in. Check your details and try again."));
        return;
      }
      router.replace("/dashboard");
    } catch {
      setError(t("Connection error. Please try again."));
    } finally { setBusy(false); }
  };

  return <><div className="auth-form-eyebrow"><LockKeyhole size={13} /><T en="OPERATOR SIGN-IN" el="ΣΥΝΔΕΣΗ OPERATOR" /></div><h1 className="auth-form-title"><T en="Welcome back." el="Καλώς επέστρεψες." /></h1><p className="auth-form-description"><T en="Pick up your training right where you left it." el="Συνέχισε την εκπαίδευσή σου από εκεί που σταμάτησες." /></p><div className="auth-mode-switch" role="tablist" aria-label={t("Choose a sign-in method")}><button type="button" role="tab" aria-selected={mode === "password"} className={mode === "password" ? "active" : ""} onClick={() => switchMode("password")}><UserRound size={14} /><T en="Password" el="Κωδικός" /></button><button type="button" role="tab" aria-selected={mode === "key"} className={mode === "key" ? "active" : ""} onClick={() => switchMode("key")}><KeyRound size={14} /><T en="Account key file" el="Αρχείο κλειδιού" /></button></div><form className="auth-form auth-form-after-tabs" onSubmit={submit}>{mode === "password" ? <><label className="block"><span className="field-label"><T en="Handle or email" el="Όνομα χρήστη ή email" /></span><input className="field" type="text" autoComplete="username" maxLength={254} value={identifier} onChange={event => setIdentifier(event.target.value)} placeholder={t("Your handle, e.g. alex_morgan") } required /></label><label className="block"><span className="field-label"><T en="Password" el="Κωδικός πρόσβασης" /></span><input className="field" type="password" autoComplete="current-password" minLength={8} maxLength={128} value={password} onChange={event => setPassword(event.target.value)} placeholder={t("Your password")} required /></label></> : <div className="auth-key-login-panel"><span className="auth-key-login-icon"><FileKey2 size={19} /></span><h2><T en="Sign in without a password" el="Σύνδεση χωρίς κωδικό" /></h2><p><T en="Choose the private Gamehack account key JSON file you downloaded when you registered." el="Επίλεξε το ιδιωτικό αρχείο JSON του Gamehack που κατέβασες κατά την εγγραφή." /></p><label className="auth-file-picker"><Upload size={16} /><span>{fileName || t("Choose account key file")}</span><input ref={fileInput} type="file" accept=".json,application/json" onChange={event => setFileName(event.target.files?.[0]?.name || "")} aria-label={t("Choose Gamehack account key file")} /></label><small className="auth-field-hint"><T en="Only your Gamehack account key file is accepted." el="Γίνεται αποδεκτό μόνο το αρχείο κλειδιού του Gamehack." /></small></div>}{error && <div className="alert-error" role="alert">{error}</div>}<button type="submit" disabled={busy} className="btn-primary w-full">{busy ? <><LoaderCircle size={15} className="animate-spin" /><T en="Signing in..." el="Σύνδεση..." /></> : <><T en="Sign in to Gamehack" el="Σύνδεση στο Gamehack" /><ArrowRight size={14} /></>}</button></form><p className="auth-switch"><T en="New to Gamehack?" el="Νέος στο Gamehack;" /> <Link href="/register"><T en="Create your free account" el="Δημιούργησε δωρεάν λογαριασμό" /></Link></p><div className="auth-privacy"><KeyRound size={12} /><T en="Forgot your password? Sign in with your account key file instead." el="Ξέχασες τον κωδικό σου; Συνδέσου με το αρχείο κλειδιού." /></div></>;
}
