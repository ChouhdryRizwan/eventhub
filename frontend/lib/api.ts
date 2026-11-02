import axios, { type AxiosRequestConfig } from "axios";
import type {
  Bookmark,
  Category,
  Event,
  EventQuery,
  Review,
  Rsvp,
  StrapiList,
  StrapiSingle,
  User,
} from "@/types";

// Public reads need no token. Authenticated calls pass the user's JWT (from the NextAuth
// session) and admin calls use STRAPI_API_TOKEN, which must only be read on the server.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

const withToken = (token?: string): AxiosRequestConfig =>
  token ? { headers: { Authorization: `Bearer ${token}` } } : {};

const serverToken = () => process.env.STRAPI_API_TOKEN;

// ---------- Events ----------

export async function getEvents(query: EventQuery = {}) {
  const { category, search, featured, page = 1, pageSize = 100 } = query;
  const params: Record<string, string | number | boolean> = {
    "populate[0]": "category",
    "populate[1]": "images",
    "sort[0]": "start_datetime:asc",
    "pagination[page]": page,
    "pagination[pageSize]": pageSize,
  };
  if (featured) params["filters[is_featured]"] = true;
  category?.forEach((slug, i) => {
    params[`filters[category][slug][$in][${i}]`] = slug;
  });
  if (search?.trim()) {
    // Match name, organizer, venue or category name (FR-08)
    const q = search.trim();
    params["filters[$or][0][title][$containsi]"] = q;
    params["filters[$or][1][organizer_name][$containsi]"] = q;
    params["filters[$or][2][venue_address][$containsi]"] = q;
    params["filters[$or][3][category][name][$containsi]"] = q;
  }
  const res = await api.get<StrapiList<Event>>("/events", { params });
  return res.data;
}

export const getFeaturedEvents = (pageSize = 6) => getEvents({ featured: true, pageSize });

export async function getEventBySlug(slug: string) {
  const res = await api.get<StrapiList<Event>>("/events", {
    params: { "filters[slug][$eq]": slug, populate: "*" },
  });
  return res.data.data[0] ?? null;
}

export async function createEvent(data: Record<string, unknown>, token: string) {
  const res = await api.post<StrapiSingle<Event>>("/events", { data }, withToken(token));
  return res.data.data;
}

/** Events the logged-in user submitted, in any moderation status. */
export async function getMyEvents(token: string) {
  const res = await api.get<StrapiList<Event>>("/events/mine", withToken(token));
  return res.data;
}

/** Server only (STRAPI_API_TOKEN): events in a given moderation status. */
export async function getEventsByStatus(status: "pending" | "published" | "rejected") {
  const res = await api.get<StrapiList<Event>>("/events", {
    params: {
      "filters[status][$eq]": status,
      "populate[0]": "category",
      "populate[1]": "images",
      "populate[2]": "submitted_by",
      "sort[0]": "createdAt:desc",
      "pagination[pageSize]": 100,
    },
    ...withToken(serverToken()),
  });
  return res.data;
}

/** Server only (STRAPI_API_TOKEN): every event in any status, newest first. */
export async function getAllEvents() {
  const res = await api.get<StrapiList<Event>>("/events", {
    params: {
      "populate[0]": "category",
      "populate[1]": "images",
      "populate[2]": "submitted_by",
      "sort[0]": "createdAt:desc",
      "pagination[pageSize]": 100,
    },
    ...withToken(serverToken()),
  });
  return res.data;
}

/** Server only (STRAPI_API_TOKEN). */
export async function deleteEvent(documentId: string) {
  await api.delete(`/events/${documentId}`, withToken(serverToken()));
}

/** Server only (STRAPI_API_TOKEN): moderation updates such as status and is_featured. */
export async function updateEvent(documentId: string, data: Partial<Event>) {
  const res = await api.put<StrapiSingle<Event>>(
    `/events/${documentId}`,
    { data },
    withToken(serverToken()),
  );
  return res.data.data;
}

// ---------- Categories ----------

export async function getCategories() {
  const res = await api.get<StrapiList<Category>>("/categories", {
    params: { "sort[0]": "name:asc", "pagination[pageSize]": 50 },
  });
  return res.data;
}

/** Published-event count per category slug (the public API only returns published events). */
export async function getCategoryCounts() {
  const res = await api.get<StrapiList<{ category?: { slug: string } | null }>>("/events", {
    params: { "fields[0]": "id", "populate[category][fields][0]": "slug", "pagination[pageSize]": 100 },
  });
  const counts: Record<string, number> = {};
  for (const event of res.data.data) {
    const slug = event.category?.slug;
    if (slug) counts[slug] = (counts[slug] ?? 0) + 1;
  }
  return counts;
}

// ---------- RSVPs ----------

const eventPopulate = {
  "populate[event][populate][0]": "category",
  "populate[event][populate][1]": "images",
  "sort[0]": "createdAt:desc",
};

// The API scopes /rsvps and /bookmarks to the logged-in user, so no user filter is sent.
export async function getMyRsvps(token: string) {
  const res = await api.get<StrapiList<Rsvp>>("/rsvps", {
    params: eventPopulate,
    ...withToken(token),
  });
  return res.data;
}

export async function getMyRsvpForEvent(eventDocumentId: string, token: string) {
  const res = await api.get<StrapiList<Rsvp>>("/rsvps", {
    params: { "filters[event][documentId][$eq]": eventDocumentId, "pagination[pageSize]": 1 },
    ...withToken(token),
  });
  return res.data.data[0] ?? null;
}

export async function createRsvp(eventDocumentId: string, token: string) {
  const res = await api.post<StrapiSingle<Rsvp>>(
    "/rsvps",
    {
      data: {
        event: eventDocumentId,
        status: "confirmed",
        rsvp_date: new Date().toISOString(),
      },
    },
    withToken(token),
  );
  return res.data.data;
}

export async function updateRsvp(
  documentId: string,
  status: "confirmed" | "cancelled",
  token: string,
) {
  const res = await api.put<StrapiSingle<Rsvp>>(
    `/rsvps/${documentId}`,
    { data: { status } },
    withToken(token),
  );
  return res.data.data;
}

// ---------- Reviews ----------

export async function getEventReviews(eventDocumentId: string) {
  const res = await api.get<StrapiList<Review>>("/reviews", {
    params: {
      "filters[event][documentId][$eq]": eventDocumentId,
      "sort[0]": "createdAt:desc",
    },
  });
  return res.data;
}

export async function createReview(
  data: { event: string; rating: number; review_text: string },
  token: string,
) {
  const res = await api.post<StrapiSingle<Review>>("/reviews", { data }, withToken(token));
  return res.data.data;
}

export async function getMyReviews(token: string) {
  const res = await api.get<StrapiList<Review>>("/reviews/mine", withToken(token));
  return res.data;
}

// ---------- Bookmarks ----------

export async function getMyBookmarks(token: string) {
  const res = await api.get<StrapiList<Bookmark>>("/bookmarks", {
    params: eventPopulate,
    ...withToken(token),
  });
  return res.data;
}

export async function getMyBookmarkForEvent(eventDocumentId: string, token: string) {
  const res = await api.get<StrapiList<Bookmark>>("/bookmarks", {
    params: { "filters[event][documentId][$eq]": eventDocumentId, "pagination[pageSize]": 1 },
    ...withToken(token),
  });
  return res.data.data[0] ?? null;
}

export async function createBookmark(eventDocumentId: string, token: string) {
  const res = await api.post<StrapiSingle<Bookmark>>(
    "/bookmarks",
    { data: { event: eventDocumentId } },
    withToken(token),
  );
  return res.data.data;
}

export async function deleteBookmark(documentId: string, token: string) {
  await api.delete(`/bookmarks/${documentId}`, withToken(token));
}

// ---------- Users ----------

export async function getMe(token: string) {
  const res = await api.get<User>("/users/me", {
    params: { populate: "profile_pic" },
    ...withToken(token),
  });
  return res.data;
}

/** Server only (STRAPI_API_TOKEN): all accounts with their role type. */
export async function getUsers() {
  const res = await api.get<(User & { role?: { type: string; name: string } | null; createdAt: string })[]>("/users", {
    params: { "populate[role][fields][0]": "type", "populate[role][fields][1]": "name", "sort[0]": "createdAt:desc", "pagination[limit]": 200 },
    ...withToken(serverToken()),
  });
  return res.data;
}

/** Server only (STRAPI_API_TOKEN): block or unblock an account. */
export async function setUserBlocked(id: number, blocked: boolean) {
  await api.put(`/users/${id}`, { blocked }, withToken(serverToken()));
}

export async function updateUser(
  id: number,
  data: Partial<User> & { password?: string },
  token: string,
) {
  const res = await api.put<User>(`/users/${id}`, data, withToken(token));
  return res.data;
}

/** Uploads one image to the Strapi media library (Cloudinary) and returns its media id. */
export async function uploadImage(file: Blob, filename: string, token: string) {
  const body = new FormData();
  body.append("files", file, filename);
  const res = await api.post<{ id: number }[]>("/upload", body, {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    timeout: 60000,
  });
  return res.data[0].id;
}

export async function changePassword(
  data: { currentPassword: string; password: string; passwordConfirmation: string },
  token: string,
) {
  await api.post("/auth/change-password", data, withToken(token));
}

export default api;
