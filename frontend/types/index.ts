// Strapi v5 returns flat entities (no `attributes` wrapper) with both a numeric `id`
// and a string `documentId`. Use `documentId` for update/delete calls.

export interface StrapiMeta {
  pagination: { page: number; pageSize: number; pageCount: number; total: number };
}

export interface StrapiList<T> {
  data: T[];
  meta: StrapiMeta;
}

export interface StrapiSingle<T> {
  data: T;
  meta: Record<string, unknown>;
}

export interface MediaFormat {
  url: string;
  width: number;
  height: number;
}

export interface Media {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null;
  url: string;
  width: number | null;
  height: number | null;
  formats?: Partial<Record<"thumbnail" | "small" | "medium" | "large", MediaFormat>> | null;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  color: string | null;
}

export type EventStatus = "pending" | "published" | "rejected";

export interface Event {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string;
  short_desc: string | null;
  category?: Category | null;
  venue_address: string;
  latitude: number | null;
  longitude: number | null;
  start_datetime: string;
  end_datetime: string | null;
  ticket_price: number;
  is_free: boolean;
  organizer_name: string | null;
  organizer_email: string | null;
  organizer_phone: string | null;
  is_featured: boolean;
  status: EventStatus;
  images?: Media[] | null;
  avg_rating: number;
  rsvp_count: number;
  submitted_by?: User | null;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  bio: string | null;
  profile_pic?: Media | null;
  confirmed: boolean;
  blocked: boolean;
}

export type RsvpStatus = "confirmed" | "cancelled";

export interface Rsvp {
  id: number;
  documentId: string;
  status: RsvpStatus;
  rsvp_date: string | null;
  event?: Event;
  createdAt: string;
}

export interface Review {
  id: number;
  documentId: string;
  rating: number;
  review_text: string;
  author_name: string | null;
  event?: Event;
  createdAt: string;
}

export interface Bookmark {
  id: number;
  documentId: string;
  event?: Event;
  createdAt: string;
}

export interface EventQuery {
  category?: string[]; // category slugs
  search?: string;
  featured?: boolean;
  page?: number;
  pageSize?: number;
}
