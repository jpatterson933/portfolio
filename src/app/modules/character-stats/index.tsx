"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { CharacterStats } from "./schema";
import styles from "./character-stats.module.css";

const CharacterSheet = dynamic(
  () => import("./CharacterSheet").then((module) => module.CharacterSheet),
  { ssr: false },
);

export function CharacterStatsLauncher({ stats }: { stats: CharacterStats }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  function close() {
    setOpen(false);
    requestAnimationFrame(() => buttonRef.current?.focus());
  }

  return (
    <>
      <button
        ref={buttonRef}
        className={styles.launcher}
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="m12 2 9 5v10l-9 5-9-5V7l9-5Z" />
          <path d="m3 7 9 5 9-5M12 12v10M7.5 4.5l9 5v5" />
        </svg>
        <span>See character stats</span>
        <span className={styles.launcherLight} aria-hidden="true" />
      </button>
      {open && <CharacterSheet stats={stats} onClose={close} />}
    </>
  );
}
