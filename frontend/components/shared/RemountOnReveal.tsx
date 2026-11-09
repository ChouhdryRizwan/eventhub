"use client";

import { useEffect, useState } from "react";

/**
 * Renders its children only while the component's effects are live.
 *
 * With `cacheComponents`, Next keeps a page you navigated away from in a hidden <Activity>: its effects
 * are cleaned up (Leaflet's `map.remove()` runs) but its state is kept. When the page is shown again the
 * old, already destroyed map instance would be reused, which throws "Map container is being reused" and
 * crashes the route. Unmounting the map while hidden and mounting a fresh one on reveal avoids that.
 */
export default function RemountOnReveal({ children, fallback = null }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  const [live, setLive] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: tracks whether effects are currently live
    setLive(true);
    return () => setLive(false);
  }, []);

  return <>{live ? children : fallback}</>;
}
