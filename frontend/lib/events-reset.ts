// Tiny external store: the navbar's "Events" link bumps a counter, and the events explorer clears its
// filters whenever the counter changes. Next keeps the last /events page (and its filters) alive via
// <Activity>, so without this the link would reopen the previous search instead of the full list.

let count = 0;
const listeners = new Set<() => void>();

export function requestEventsReset() {
  count += 1;
  listeners.forEach((listener) => listener());
}

export function subscribeEventsReset(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getEventsResetCount = () => count;
