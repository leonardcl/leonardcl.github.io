/**
 * Shown while a lazily-loaded route fetches its chunk. Deliberately quiet —
 * on a fast connection it should barely register, and it shouldn't flash
 * anything that competes with the page arriving behind it.
 */
const RouteLoading = () => (
  <div className="min-h-screen min-h-dvh bg-bone flex items-center justify-center">
    <span className="h-2.5 w-2.5 rotate-45 bg-blush animate-ping" />
  </div>
);

export default RouteLoading;
