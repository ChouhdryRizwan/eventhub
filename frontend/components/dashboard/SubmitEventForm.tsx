"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { submitEventAction, type SubmitEventState, type SubmitField } from "@/app/actions/submit-event";
import LocationPicker from "@/components/dashboard/LocationPicker";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import type { Category } from "@/types";

const MAX_IMAGES = 5;
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} role="alert" data-field-error className="mt-1 text-xs text-red-600">
      {message}
    </p>
  ) : null;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4 rounded-card border border-gray-200 bg-white p-5 sm:p-6">
      <legend className="px-2 text-lg font-bold text-gray-900">{title}</legend>
      {children}
    </fieldset>
  );
}

const textareaClass =
  "w-full rounded-xl border border-gray-200 bg-white p-4 text-sm placeholder:text-gray-400 focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/30";

export default function SubmitEventForm({ categories }: { categories: Category[] }) {
  const [values, setValues] = useState({
    title: "",
    category: "",
    short_desc: "",
    description: "",
    venue_address: "",
    start_datetime: "",
    end_datetime: "",
    ticket_price: "",
    organizer_name: "",
    organizer_email: "",
    organizer_phone: "",
  });
  const [coords, setCoords] = useState<{ latitude: number | null; longitude: number | null }>({
    latitude: null,
    longitude: null,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [state, setState] = useState<SubmitEventState>({});
  const [pending, startTransition] = useTransition();
  const fileInput = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const errors = state.fieldErrors ?? {};

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  // Object URLs for the thumbnails, derived from the selection and revoked when it changes.
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  const addFiles = (picked: FileList | null) => {
    if (!picked) return;
    const next = [...files];
    for (const file of Array.from(picked)) {
      if (!IMAGE_TYPES.includes(file.type)) return void toast.error(`${file.name}: use a JPG, PNG or WebP image.`);
      if (file.size > MAX_IMAGE_BYTES) return void toast.error(`${file.name} is over 3 MB.`);
      if (next.length >= MAX_IMAGES) return void toast.error(`You can add up to ${MAX_IMAGES} photos.`);
      next.push(file);
    }
    setFiles(next);
    if (fileInput.current) fileInput.current.value = "";
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(values).forEach(([key, value]) => data.append(key, value));
    data.append("latitude", coords.latitude?.toString() ?? "");
    data.append("longitude", coords.longitude?.toString() ?? "");
    files.forEach((file) => data.append("images", file));

    startTransition(async () => {
      // On success the action redirects to the dashboard; it only returns when something is wrong.
      const result = await submitEventAction(data);
      if (result) {
        setState(result);
        if (result.error) toast.error(result.error);
      }
    });
  };

  // Once the errors are rendered, jump to the first invalid field (document order) and focus it.
  useEffect(() => {
    if (!state.fieldErrors || Object.keys(state.fieldErrors).length === 0) return;
    const target = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [data-field-error]');
    if (!target) return;
    target.scrollIntoView({ block: "center", behavior: "smooth" });
    target.focus({ preventScroll: true });
  }, [state]);

  const err = (field: SubmitField) => errors[field];
  const invalid = (field: SubmitField) => !!errors[field];

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-6" noValidate>
      {state.error && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </p>
      )}

      <Card title="Event details">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={values.title} onChange={set("title")} maxLength={120} required aria-invalid={invalid("title")} aria-describedby="title-error" />
          <FieldError id="title-error" message={err("title")} />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={values.category}
            onChange={set("category")}
            required
            aria-invalid={invalid("category")}
            aria-describedby="category-error"
            className="min-h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm focus:border-primary-light focus:outline-none focus:ring-2 focus:ring-primary-light/30"
          >
            <option value="">Choose a category…</option>
            {categories.map((c) => (
              <option key={c.documentId} value={c.documentId}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
          <FieldError id="category-error" message={err("category")} />
        </div>
        <div>
          <Label htmlFor="short_desc">
            Short summary <span className="font-normal text-gray-400">(shown on cards, {values.short_desc.length}/200)</span>
          </Label>
          <Input id="short_desc" value={values.short_desc} onChange={set("short_desc")} maxLength={200} aria-invalid={invalid("short_desc")} aria-describedby="short_desc-error" />
          <FieldError id="short_desc-error" message={err("short_desc")} />
        </div>
        <div>
          <Label htmlFor="description">Full description</Label>
          <textarea
            id="description"
            rows={6}
            value={values.description}
            onChange={set("description")}
            required
            aria-invalid={invalid("description")}
            aria-describedby="description-error"
            className={textareaClass}
          />
          <FieldError id="description-error" message={err("description")} />
        </div>
      </Card>

      <Card title="When & where">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="start_datetime">Starts (local time)</Label>
            <Input id="start_datetime" type="datetime-local" value={values.start_datetime} onChange={set("start_datetime")} required aria-invalid={invalid("start_datetime")} aria-describedby="start-error" />
            <FieldError id="start-error" message={err("start_datetime")} />
          </div>
          <div>
            <Label htmlFor="end_datetime">
              Ends <span className="font-normal text-gray-400">(optional)</span>
            </Label>
            <Input id="end_datetime" type="datetime-local" value={values.end_datetime} onChange={set("end_datetime")} aria-invalid={invalid("end_datetime")} aria-describedby="end-error" />
            <FieldError id="end-error" message={err("end_datetime")} />
          </div>
        </div>
        <div>
          <Label htmlFor="venue_address">Venue address</Label>
          <Input id="venue_address" value={values.venue_address} onChange={set("venue_address")} required placeholder="e.g. Community Hall, Main Boulevard, your city" aria-invalid={invalid("venue_address")} aria-describedby="venue-error" />
          <FieldError id="venue-error" message={err("venue_address")} />
        </div>
        <div>
          <p className="mb-1.5 text-sm font-semibold text-gray-700">Pin the venue on the map</p>
          <div className="h-72 overflow-hidden rounded-card border border-gray-200">
            <LocationPicker
              latitude={coords.latitude}
              longitude={coords.longitude}
              onChange={(latitude, longitude) => setCoords({ latitude, longitude })}
            />
          </div>
          <p className="mt-1.5 text-xs text-gray-500" aria-live="polite">
            {coords.latitude != null
              ? `Selected: ${coords.latitude}, ${coords.longitude}`
              : "Click the map to place the pin. Guests use it to find your event."}
          </p>
          <FieldError id="location-error" message={err("location")} />
        </div>
      </Card>

      <Card title="Tickets & organizer">
        <div>
          <Label htmlFor="ticket_price">
            Ticket price in Rs. <span className="font-normal text-gray-400">(leave empty or 0 for free)</span>
          </Label>
          <Input id="ticket_price" type="number" min={0} step={50} inputMode="numeric" value={values.ticket_price} onChange={set("ticket_price")} aria-invalid={invalid("ticket_price")} aria-describedby="price-error" />
          <FieldError id="price-error" message={err("ticket_price")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="organizer_name">Organizer name</Label>
            <Input id="organizer_name" value={values.organizer_name} onChange={set("organizer_name")} />
          </div>
          <div>
            <Label htmlFor="organizer_email">Organizer email</Label>
            <Input id="organizer_email" type="email" value={values.organizer_email} onChange={set("organizer_email")} aria-invalid={invalid("organizer_email")} aria-describedby="oemail-error" />
            <FieldError id="oemail-error" message={err("organizer_email")} />
          </div>
          <div>
            <Label htmlFor="organizer_phone">Organizer phone</Label>
            <Input id="organizer_phone" type="tel" value={values.organizer_phone} onChange={set("organizer_phone")} aria-invalid={invalid("organizer_phone")} aria-describedby="ophone-error" />
            <FieldError id="ophone-error" message={err("organizer_phone")} />
          </div>
        </div>
      </Card>

      <Card title="Photos">
        <p className="text-sm text-gray-500">Up to {MAX_IMAGES} photos (JPG, PNG or WebP, 3 MB each). The first is the cover.</p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {previews.map((src, i) => (
            <li key={src} className="relative aspect-square overflow-hidden rounded-xl border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, not a remote image */}
              <img src={src} alt={`Selected photo ${i + 1}: ${files[i]?.name}`} className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setFiles((list) => list.filter((_, idx) => idx !== i))}
                aria-label={`Remove photo ${i + 1}`}
                className="absolute right-1.5 top-1.5 inline-flex size-9 items-center justify-center rounded-full bg-ink/80 text-white hover:bg-ink"
              >
                <X className="size-4" aria-hidden />
              </button>
            </li>
          ))}
          {files.length < MAX_IMAGES && (
            <li>
              <button
                type="button"
                onClick={() => fileInput.current?.click()}
                className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-300 text-sm font-semibold text-gray-500 hover:border-primary-light hover:text-primary"
              >
                <ImagePlus className="size-6" aria-hidden />
                Add photo
              </button>
            </li>
          )}
        </ul>
        <input ref={fileInput} id="images" type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" onChange={(e) => addFiles(e.target.files)} />
        <FieldError id="images-error" message={err("images")} />
      </Card>

      <div className="flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">Your event is reviewed by our team before it appears on the map.</p>
        <Button type="submit" size="lg" disabled={pending}>
          {pending && <Loader2 className="size-5 animate-spin" aria-hidden />}
          {pending ? "Submitting…" : "Submit for review"}
        </Button>
      </div>
    </form>
  );
}
