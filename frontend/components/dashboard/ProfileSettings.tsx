"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { Camera, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  changePasswordAction,
  updateProfileAction,
  uploadAvatarAction,
  type ProfileState,
} from "@/app/actions/profile";
import Avatar from "@/components/shared/Avatar";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

const initial: ProfileState = {};

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className="mt-1 text-xs text-red-600">
      {message}
    </p>
  ) : null;
}

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="rounded-card border border-gray-200 bg-white p-5 sm:p-6">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      <p className="mb-5 mt-1 text-sm text-gray-500">{description}</p>
      {children}
    </section>
  );
}

interface ProfileSettingsProps {
  user: { name: string; email: string; phone: string; bio: string; avatar: string | null };
}

export default function ProfileSettings({ user }: ProfileSettingsProps) {
  // ---- details (controlled, so edited values persist after the action resets the form) ----
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [bio, setBio] = useState(user.bio);
  const [profile, profileAction, profilePending] = useActionState(updateProfileAction, initial);
  const { refresh: refreshSession } = useAuth();

  useEffect(() => {
    if (profile.ok) {
      toast.success(profile.message ?? "Profile updated.");
      refreshSession(); // the cookie was updated on the server; re-read it so the navbar shows the new name
    }
    else if (profile.error) toast.error(profile.error);
  }, [profile, refreshSession]);

  // ---- password ----
  const [password, passwordAction, passwordPending] = useActionState(changePasswordAction, initial);
  const passwordForm = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (password.ok) {
      toast.success(password.message ?? "Password changed.");
      passwordForm.current?.reset();
    } else if (password.error) toast.error(password.error);
  }, [password]);

  // ---- avatar ----
  const [avatar, setAvatar] = useState(user.avatar);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, startUpload] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);

  const onPickAvatar = (file: File | undefined) => {
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return void toast.error("Use a JPG, PNG or WebP image.");
    if (file.size > 2 * 1024 * 1024) return void toast.error("The image must be under 2 MB.");

    setPreview(URL.createObjectURL(file));
    const data = new FormData();
    data.append("avatar", file);
    startUpload(async () => {
      const result = await uploadAvatarAction(data);
      if (result.ok) {
        setAvatar(result.url ?? null);
        toast.success("Profile photo updated.");
      } else {
        toast.error(result.error ?? "The upload failed.");
      }
      setPreview(null);
      if (fileInput.current) fileInput.current.value = "";
    });
  };

  return (
    <div className="space-y-6">
      <Section title="Profile photo" description="A square JPG, PNG or WebP image up to 2 MB.">
        <div className="flex items-center gap-4">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- local blob preview, not a remote image
            <img src={preview} alt="New profile photo preview" className="size-20 rounded-full object-cover" />
          ) : (
            <Avatar name={name || user.email} src={avatar} size={80} />
          )}
          <div>
            <input
              ref={fileInput}
              id="avatar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(e) => onPickAvatar(e.target.files?.[0])}
              disabled={uploading}
            />
            <Button variant="outline" disabled={uploading} onClick={() => fileInput.current?.click()}>
              {uploading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Camera className="size-4" aria-hidden />}
              {uploading ? "Uploading…" : "Change photo"}
            </Button>
          </div>
        </div>
      </Section>

      <Section title="Account details" description="This is how you appear on reviews and to event organizers.">
        <form action={profileAction} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              name="full_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              aria-invalid={!!profile.fieldErrors?.full_name}
              aria-describedby="full_name-error"
            />
            <FieldError id="full_name-error" message={profile.fieldErrors?.full_name} />
          </div>
          <div>
            <Label htmlFor="settings-email">Email</Label>
            <Input id="settings-email" value={user.email} readOnly disabled />
            <p className="mt-1 text-xs text-gray-500">Your email is your login and can&apos;t be changed.</p>
          </div>
          <div>
            <Label htmlFor="settings-phone">Phone</Label>
            <Input
              id="settings-phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              autoComplete="tel"
              aria-invalid={!!profile.fieldErrors?.phone}
              aria-describedby="phone-error"
            />
            <FieldError id="phone-error" message={profile.fieldErrors?.phone} />
          </div>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              name="bio"
              rows={3}
              maxLength={500}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/30"
            />
            <FieldError id="bio-error" message={profile.fieldErrors?.bio} />
          </div>
          <Button type="submit" disabled={profilePending}>
            {profilePending && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {profilePending ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </Section>

      <Section title="Change password" description="Use at least 8 characters.">
        <form ref={passwordForm} action={passwordAction} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="currentPassword">Current password</Label>
            <Input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              aria-invalid={!!password.fieldErrors?.currentPassword}
              aria-describedby="currentPassword-error"
            />
            <FieldError id="currentPassword-error" message={password.fieldErrors?.currentPassword} />
          </div>
          <div>
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              name="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!password.fieldErrors?.password}
              aria-describedby="new-password-error"
            />
            <FieldError id="new-password-error" message={password.fieldErrors?.password} />
          </div>
          <div>
            <Label htmlFor="passwordConfirmation">Confirm new password</Label>
            <Input id="passwordConfirmation" name="passwordConfirmation" type="password" autoComplete="new-password" />
          </div>
          <Button type="submit" variant="dark" disabled={passwordPending}>
            {passwordPending && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {passwordPending ? "Updating…" : "Update password"}
          </Button>
        </form>
      </Section>
    </div>
  );
}
