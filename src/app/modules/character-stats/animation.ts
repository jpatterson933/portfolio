/** Count up alongside the liquid fills without triggering React renders. */
export function animateStats(host: HTMLElement) {
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const counters = Array.from(
    host.querySelectorAll<HTMLElement>("[data-count]"),
  ).map((element) => ({
    element,
    value: Number(element.dataset.count),
    delay: Number(element.dataset.delay ?? 0),
  }));
  let frame = 0;
  let elapsed = 0;
  let previous: number | undefined;
  let finished = false;
  const duration = 1100;
  const finishAt = Math.max(...counters.map(({ delay }) => delay)) + duration;

  function paint(final = false) {
    for (const { element, value, delay } of counters) {
      const progress = final
        ? 1
        : Math.min(1, Math.max(0, (elapsed - delay) / duration));
      const eased = 1 - (1 - progress) ** 3;
      element.textContent = String(Math.round(value * eased)).padStart(2, "0");
    }
  }
  function tick(now: number) {
    if (previous !== undefined) elapsed += Math.min(now - previous, 64);
    previous = now;
    paint();
    if (elapsed < finishAt) frame = requestAnimationFrame(tick);
    else {
      finished = true;
      frame = 0;
    }
  }
  function sync() {
    cancelAnimationFrame(frame);
    frame = 0;
    previous = undefined;
    host.dataset.paused = String(document.hidden);
    if (preference.matches) {
      paint(true);
      finished = true;
    } else if (!document.hidden && !finished)
      frame = requestAnimationFrame(tick);
  }
  paint(preference.matches);
  sync();
  document.addEventListener("visibilitychange", sync);
  preference.addEventListener("change", sync);
  return () => {
    cancelAnimationFrame(frame);
    document.removeEventListener("visibilitychange", sync);
    preference.removeEventListener("change", sync);
  };
}
