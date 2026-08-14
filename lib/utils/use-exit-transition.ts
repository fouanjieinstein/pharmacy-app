"use client";

import { useEffect, useState } from "react";

/**
 * Keeps an element mounted for `duration` ms after `open` flips to false, so
 * a CSS closing animation (e.g. animate-fade-out) can play instead of the
 * element vanishing the instant it unmounts.
 */
export function useExitTransition(open: boolean, duration = 200): boolean {
  const [shouldRender, setShouldRender] = useState(open);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) setShouldRender(true);
  }

  useEffect(() => {
    if (open) return;
    const timeout = setTimeout(() => setShouldRender(false), duration);
    return () => clearTimeout(timeout);
  }, [open, duration]);

  return shouldRender;
}
