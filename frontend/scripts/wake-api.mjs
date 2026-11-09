// Runs before `next build` (npm "prebuild"). The free Render API sleeps after inactivity and can need
// a minute or two to wake; pages that are prerendered at build time need it to answer. This pings its
// health endpoint until it responds. It never fails the build: if the API does not wake, the build
// simply continues and its own retries take over.

const base = (process.env.NEXT_PUBLIC_STRAPI_URL ?? "").replace(/\/$/, "");
const local = /^https?:\/\/(localhost|127\.0\.0\.1)/.test(base);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function wake() {
  if (!base || local) return;

  const deadline = Date.now() + 150_000;
  let tries = 0;
  while (Date.now() < deadline) {
    tries += 1;
    try {
      const res = await fetch(`${base}/_health`, { signal: AbortSignal.timeout(20_000) });
      if (res.status === 204) {
        console.log(`[wake-api] API is awake (attempt ${tries}).`);
        return;
      }
    } catch {
      // still waking up
    }
    await sleep(3_000);
  }
  console.log("[wake-api] API did not wake in time; continuing with the build.");
}

await wake().catch(() => {});
process.exitCode = 0;
