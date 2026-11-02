// Small inline SVG social icons (lucide no longer ships brand icons).
const base = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export function FacebookIcon() {
  return (
    <svg {...base}>
      <path d="M15 8h-2a2 2 0 0 0-2 2v11M8 13h7M15 3h-1a4 4 0 0 0-4 4v3" />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg {...base}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function XIcon() {
  return (
    <svg {...base}>
      <path d="M4 4l16 16M20 4L4 20" />
    </svg>
  );
}

export function YoutubeIcon() {
  return (
    <svg {...base}>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" />
    </svg>
  );
}
