"use client";

import { useState } from "react";
import { Check, Pencil, Save, X } from "lucide-react";
import { useProgress, useProgressActions } from "@/components/ProgressProvider";

export default function ProfileEditor() {
  const { player } = useProgress();
  const { ensureSession, refresh: refreshProgress } = useProgressActions();
  const [open, setOpen] = useState(false);
  const [displayName, setDisplayName] = useState(player.displayName);
  const [bio, setBio] = useState(player.bio);
  const [location, setLocation] = useState(player.location);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); setLoading(true); setError("");
    try {
      await ensureSession();
      const response = await fetch("/api/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ displayName, bio, location }) });
      const result = await response.json();
      if (!response.ok) { setError(result.error || "Unable to save changes."); return; }
      await refreshProgress();
      setOpen(false);
    }
    catch { setError("Connection error. Please try again."); }
    finally { setLoading(false); }
  };
  return <><button onClick={() => { setDisplayName(player.displayName); setBio(player.bio); setLocation(player.location); setError(""); setOpen(true); }} className="btn-secondary !min-h-[36px]"><Pencil size={13} /> Edit profile</button>{open && <div className="modal-backdrop !items-center !pt-8" onMouseDown={event => { if (event.target === event.currentTarget) setOpen(false); }}><div className="command-modal !max-w-[460px] p-6" role="dialog" aria-modal="true" aria-label="Edit profile"><div className="flex items-start justify-between"><div><span className="text-[10px] font-bold tracking-widest text-lime">OPERATOR PROFILE</span><h2 className="display-font mt-1 text-[21px] font-bold">Edit your profile</h2></div><button onClick={() => setOpen(false)} className="icon-button" aria-label="Close dialog"><X size={18} /></button></div><form className="mt-6 space-y-4" onSubmit={save}><div><label className="field-label" htmlFor="profile-name">Display name</label><input id="profile-name" className="field" minLength={2} maxLength={60} value={displayName} onChange={event => setDisplayName(event.target.value)} required /></div><div><label className="field-label" htmlFor="profile-location">Location</label><input id="profile-location" className="field" maxLength={80} value={location} onChange={event => setLocation(event.target.value)} placeholder="Global" /></div><div><label className="field-label" htmlFor="profile-bio">About you</label><textarea id="profile-bio" className="field min-h-[100px] resize-y" maxLength={280} value={bio} onChange={event => setBio(event.target.value)} placeholder="Tell the arena about yourself..." /><p className="mt-1 text-right text-[10px] text-[#81919b]">{bio.length}/280</p></div>{error && <div className="alert-error" role="alert">{error}</div>}<div className="flex gap-2"><button disabled={loading} className="btn-primary flex-1" type="submit"><Save size={14} />{loading ? "Saving..." : "Save changes"}</button><button type="button" className="btn-quiet" onClick={() => setOpen(false)}>Cancel</button></div></form></div></div>}</>;
}
