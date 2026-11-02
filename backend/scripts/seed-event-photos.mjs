// Attaches sample photos (Unsplash, free to use) to the 16 seeded events.
// Re-runnable: events that already have photos are skipped.
//
//   STRAPI_URL=http://localhost:1337 STRAPI_API_TOKEN=<full-access token> node scripts/seed-event-photos.mjs
//
// Photos are downloaded, uploaded to Strapi's media library (Cloudinary) and linked to each event.

const STRAPI_URL = (process.env.STRAPI_URL || "http://localhost:1337").replace(/\/$/, "");
const TOKEN = process.env.STRAPI_API_TOKEN;
if (!TOKEN) {
  console.error("Set STRAPI_API_TOKEN to a Strapi full-access API token.");
  process.exit(1);
}

const photo = (id) => `https://images.unsplash.com/photo-${id}?w=1400&q=78&auto=format&fit=crop`;

// event title -> [[unsplash id, alt text], ...]  (first photo is the cover)
const PHOTOS = {
  "Jazz Night 2026": [
    ["1415201364774-f6f0bb35f28f", "Saxophone player performing at a live jazz night"],
    ["1511192336575-5a79af67a629", "Musician playing a trumpet on stage"],
  ],
  "City Football League": [
    ["1540747913346-19e32dc3e97e", "Floodlit stadium pitch before an evening match"],
    ["1461896836934-ffe607ba8211", "Athlete crouching on the starting blocks of a running track"],
  ],
  "AI & Future Tech Summit": [
    ["1505373877841-8d25f7d46678", "Speaker presenting on a large screen at a technology conference"],
    ["1531482615713-2afd69097998", "Developers working together at a computer"],
  ],
  "Food Festival 2026": [
    ["1555939594-58d7cb561ad1", "Grilled kebabs and sides served at a food festival"],
    ["1504674900247-0877df9cc836", "Colourful plates of freshly cooked food"],
  ],
  "Art Exhibition 2026": [
    ["1531243269054-5ebf6f34081e", "Artist standing before a wall of paintings in a gallery"],
    ["1536924940846-227afb31e2a5", "Close-up of an abstract oil painting"],
  ],
  "Yoga & Wellness Day": [
    ["1544367567-0f2fcb009e0b", "Person doing a yoga pose on the beach at sunset"],
    ["1506126613408-eca07ce68773", "Silhouette meditating against a glowing sunset"],
  ],
  "Dev Conference 2026": [
    ["1591115765373-5207764f72e7", "Developer giving a talk to an attentive audience"],
    ["1523580494863-6f3031224c94", "Attendees at a technology conference session"],
  ],
  "Electronic Music Fest": [
    ["1514525253161-7a46d19cd819", "Crowd under neon lights at an electronic music festival"],
    ["1492684223066-81342ee5ff30", "Confetti falling over a dancing festival crowd"],
  ],
  "Karachi Marathon 2026": [
    ["1552674605-db6ffd4facb5", "Runners training against a blue evening sky"],
    ["1517649763962-0c623066013b", "Cyclists racing together in a pack"],
  ],
  "Street Food Carnival": [
    ["1565299585323-38d6b0865b47", "Street-style tacos with fresh toppings"],
    ["1504674900247-0877df9cc836", "Flat lay of street food dishes"],
  ],
  "Photography Masterclass": [
    ["1452587925148-ce544e77e70d", "Vintage camera resting on a map with printed photos"],
    ["1488646953014-85cb44e25828", "Camera lens, notebook and travel map on a table"],
  ],
  "Community Clean-up Drive": [
    ["1618477461853-cf6ed80faba5", "Volunteers collecting rubbish on a beach"],
    ["1559027615-cd4628902d4a", "Volunteer in a bright shirt at a community event"],
  ],
  "Rock the City Concert": [
    ["1540039155733-5bb30b53aa14", "Crowd with raised hands at a live rock concert"],
    ["1459749411175-04bf5292ceea", "Stage lights and silhouettes at a concert"],
  ],
  "Badminton Championship": [
    ["1626224583764-f87db24ac4ea", "Badminton player leaping to smash on an indoor court"],
  ],
  "Women in Tech Summit": [
    ["1573164713988-8665fc963095", "Two women colleagues talking in a modern tech office"],
    ["1531482615713-2afd69097998", "Team collaborating over code on a screen"],
  ],
  "Food Photography Class": [
    ["1414235077428-338989a2e8c0", "Beautifully plated dish on a restaurant table"],
    ["1452587925148-ce544e77e70d", "Camera and prints used in a photography class"],
  ],
};

const auth = { Authorization: `Bearer ${TOKEN}` };

// Network hiccups (slow links, Unsplash/Strapi timeouts) are retried with a growing delay.
async function retry(label, fn, attempts = 12) {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i >= attempts) throw error;
      console.log(`  retry ${i}/${attempts - 1} (${label}): ${error.cause?.code || error.message.slice(0, 60)}`);
      await new Promise((r) => setTimeout(r, Math.min(2000 * i, 10000)));
    }
  }
}

async function api(path, options = {}) {
  const res = await fetch(`${STRAPI_URL}/api${path}`, { ...options, headers: { ...auth, ...(options.headers || {}) } });
  if (!res.ok) throw new Error(`${options.method || "GET"} ${path} -> ${res.status} ${await res.text()}`);
  return res.json();
}

async function upload(url, name, alt) {
  const bytes = await retry(`download ${name}`, async () => {
    const image = await fetch(url, { signal: AbortSignal.timeout(60000) });
    if (!image.ok) throw new Error(`download failed (${image.status}): ${url}`);
    return image.arrayBuffer();
  });
  return retry(`upload ${name}`, async () => {
    const form = new FormData();
    form.append("files", new Blob([bytes], { type: "image/jpeg" }), `${name}.jpg`);
    form.append("fileInfo", JSON.stringify({ alternativeText: alt, name }));
    const uploaded = await api("/upload", { method: "POST", body: form });
    return uploaded[0].id;
  });
}

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const { data: events } = await api("/events?pagination[pageSize]=100&populate[images][fields][0]=id&fields[0]=title");
let attached = 0;

for (const event of events) {
  const photos = PHOTOS[event.title];
  if (!photos) continue;
  if (event.images?.length) {
    console.log(`skip   ${event.title} (already has ${event.images.length} photo(s))`);
    continue;
  }
  const ids = [];
  for (const [i, [id, alt]] of photos.entries()) ids.push(await upload(photo(id), `${slug(event.title)}-${i + 1}`, alt));
  await api(`/events/${event.documentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ data: { images: ids } }),
  });
  attached++;
  console.log(`added  ${event.title} (${ids.length} photo${ids.length > 1 ? "s" : ""})`);
}

console.log(`Done. Photos attached to ${attached} event(s).`);
