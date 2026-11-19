"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ExternalLink, Loader2, LockKeyhole, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { PLATFORMS } from "@/lib/constants";

type ProfileItem = { ownerName: string; tagline: string; aboutText: string; contactEmail: string };
type SocialItem = { id: number; platform: string; handle: string; url: string; accent: string };

export default function SocialForm({
  profile,
  socials,
  requiresOwnerKey = false,
}: {
  profile: ProfileItem;
  socials: SocialItem[];
  requiresOwnerKey?: boolean;
}) {
  const router = useRouter();
  const [ownerKey, setOwnerKey] = useState("");
  const [profileBusy, setProfileBusy] = useState(false);
  const [socialBusy, setSocialBusy] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [socialMessage, setSocialMessage] = useState("");
  const [profileOk, setProfileOk] = useState(true);
  const [socialOk, setSocialOk] = useState(true);
  const [deleting, setDeleting] = useState(0);

  function headers(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      ...(requiresOwnerKey ? { "x-owner-key": ownerKey } : {}),
    };
  }

  async function readError(response: Response, fallback: string): Promise<string> {
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    return data.error || fallback;
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfileBusy(true);
    setProfileMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          ownerName: form.get("ownerName"),
          tagline: form.get("tagline"),
          aboutText: form.get("aboutText"),
          contactEmail: form.get("contactEmail"),
        }),
      });
      if (!response.ok) throw new Error(await readError(response, "Could not save the profile."));
      setProfileOk(true);
      setProfileMessage("Profile updated.");
      router.refresh();
    } catch (error) {
      setProfileOk(false);
      setProfileMessage(error instanceof Error ? error.message : "Could not save the profile.");
    } finally {
      setProfileBusy(false);
    }
  }

  async function addSocial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSocialBusy(true);
    setSocialMessage("");
    const element = event.currentTarget;
    const form = new FormData(element);
    try {
      const response = await fetch("/api/socials", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({
          platform: form.get("platform"),
          handle: form.get("handle"),
          url: form.get("url"),
        }),
      });
      if (!response.ok) throw new Error(await readError(response, "Could not add the handle."));
      element.reset();
      setSocialOk(true);
      setSocialMessage("Handle added and visible everywhere.");
      router.refresh();
    } catch (error) {
      setSocialOk(false);
      setSocialMessage(error instanceof Error ? error.message : "Could not add the handle.");
    } finally {
      setSocialBusy(false);
    }
  }

  async function removeSocial(id: number) {
    setDeleting(id);
    try {
      const response = await fetch("/api/socials", {
        method: "DELETE",
        headers: headers(),
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error(await readError(response, "Could not remove the handle."));
      setSocialOk(true);
      setSocialMessage("Handle removed.");
      router.refresh();
    } catch (error) {
      setSocialOk(false);
      setSocialMessage(error instanceof Error ? error.message : "Could not remove the handle.");
    } finally {
      setDeleting(0);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {requiresOwnerKey ? (
        <div className="pm-card flex flex-wrap items-center gap-4 border-[#8b5cf6]/25 bg-[#faf7ff] p-5 lg:col-span-2">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#8b5cf6]/12 text-[#7c3aed]"><LockKeyhole className="h-5 w-5" /></span>
          <div className="min-w-[240px] flex-1">
            <h3 className="text-sm font-black">Private owner key</h3>
            <p className="mt-0.5 text-xs text-gray-500">Only owner tools need this key. Readers and creators still use the site without any verification.</p>
          </div>
          <input
            type="password"
            value={ownerKey}
            onChange={(event) => setOwnerKey(event.target.value)}
            placeholder="Enter your OWNER_EDIT_KEY"
            autoComplete="off"
            className="pm-input max-w-[300px]"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-bold text-amber-800 lg:col-span-2">
          <ShieldCheck className="h-5 w-5 shrink-0" />
          Demo mode: owner tools are open here so you can try them. Set a private OWNER_EDIT_KEY before public launch to lock owner-only edits. Normal users still never need verification.
        </div>
      )}

      <form onSubmit={saveProfile} className="pm-card p-6">
        <h3 className="text-lg font-black">Edit owner profile</h3>
        <p className="mt-1 text-xs text-gray-500">These details appear on the About page and footer.</p>
        <div className="mt-5 space-y-4">
          <div><label className="pm-label" htmlFor="ownerName">Owner / team name</label><input id="ownerName" name="ownerName" className="pm-input" defaultValue={profile.ownerName} maxLength={80} required /></div>
          <div><label className="pm-label" htmlFor="tagline">Tagline</label><input id="tagline" name="tagline" className="pm-input" defaultValue={profile.tagline} maxLength={160} required /></div>
          <div><label className="pm-label" htmlFor="aboutText">Our story</label><textarea id="aboutText" name="aboutText" className="pm-input min-h-[120px]" defaultValue={profile.aboutText} maxLength={3000} required /></div>
          <div><label className="pm-label" htmlFor="contactEmail">Contact email</label><input id="contactEmail" name="contactEmail" type="email" className="pm-input" defaultValue={profile.contactEmail} maxLength={120} required /></div>
        </div>
        {profileMessage && (
          <p className={`mt-3 inline-flex items-center gap-1.5 text-xs font-bold ${profileOk ? "text-[#008c40]" : "text-red-500"}`}>
            {profileOk && <CheckCircle2 className="h-3.5 w-3.5" />}{profileMessage}
          </p>
        )}
        <button type="submit" disabled={profileBusy} className="pm-btn mt-5 w-full">{profileBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save profile"}</button>
      </form>

      <div className="space-y-6">
        <form onSubmit={addSocial} className="pm-card p-6">
          <h3 className="text-lg font-black">Add a social handle</h3>
          <p className="mt-1 text-xs text-gray-500">Instagram, YouTube, X, Discord, TikTok — whatever you use.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div><label className="pm-label" htmlFor="platform">Platform</label><select id="platform" name="platform" className="pm-input">{PLATFORMS.map((platform) => <option key={platform.name} value={platform.name}>{platform.name}</option>)}</select></div>
            <div><label className="pm-label" htmlFor="handle">Handle</label><input id="handle" name="handle" className="pm-input" placeholder="@promiseme.com" maxLength={80} required /></div>
            <div className="sm:col-span-2"><label className="pm-label" htmlFor="socialUrl">Profile URL</label><input id="socialUrl" name="url" className="pm-input" placeholder="https://instagram.com/yourhandle" maxLength={500} required /></div>
          </div>
          {socialMessage && <p className={`mt-3 text-xs font-bold ${socialOk ? "text-[#008c40]" : "text-red-500"}`}>{socialOk ? "✓ " : ""}{socialMessage}</p>}
          <button type="submit" disabled={socialBusy} className="pm-btn mt-5 w-full">{socialBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Plus className="h-4 w-4" /> Add handle</>}</button>
        </form>

        <div className="pm-card p-6">
          <h3 className="text-lg font-black">Live handles ({socials.length})</h3>
          <div className="mt-4 space-y-2">
            {socials.map((social) => (
              <div key={social.id} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                <span className="h-9 w-1.5 shrink-0 rounded-full" style={{ background: social.accent }} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black">{social.platform}</p>
                  <a href={social.url} target="_blank" rel="noreferrer" className="inline-flex max-w-full items-center gap-1 truncate text-xs text-gray-500 hover:text-[#00a94f]">{social.handle}<ExternalLink className="h-3 w-3" /></a>
                </div>
                <button type="button" onClick={() => removeSocial(social.id)} disabled={deleting === social.id} aria-label={`Remove ${social.platform}`} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
