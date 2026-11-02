"use client";

// Last resort: replaces the root layout, so it brings its own <html>, <body> and inline styles.
export default function GlobalError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#0d0d0d", color: "#fff" }}>
        <main style={{ maxWidth: 480, margin: "0 auto", padding: "96px 16px", textAlign: "center" }}>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>EventHub is having trouble</h1>
          <p style={{ color: "#d1d5db", marginBottom: 24 }}>Something unexpected happened. Please try again.</p>
          <button
            type="button"
            onClick={() => retry()}
            style={{ minHeight: 44, padding: "0 24px", borderRadius: 12, border: 0, background: "#7c3aed", color: "#fff", fontWeight: 600, cursor: "pointer" }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
