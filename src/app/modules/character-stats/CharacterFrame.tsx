import styles from "./character-stats.module.css";

export function CharacterFrame() {
  return (
    <div className={styles.frame} aria-hidden="true">
      {[0, 1, 2, 3].map((corner) => (
        <svg className={styles.frameCorner} key={corner} viewBox="0 0 80 80">
          <path d="M4 76V4H76L62 11H11V62Z" fill="var(--frame-shadow)" />
          <path
            d="M5 65V5H65M12 50V12H50"
            fill="none"
            stroke="var(--frame-highlight)"
            strokeWidth="1"
          />
          <path
            d="M18 18 36 12 27 27 12 36ZM18 18 30 30M30 30 38 28 28 38Z"
            fill="var(--frame-metal)"
            stroke="var(--accent)"
            strokeWidth=".6"
          />
          <path
            d="M7 45 12 40 17 45 12 50ZM45 7 50 12 45 17 40 12Z"
            fill="var(--frame-highlight)"
          />
        </svg>
      ))}
    </div>
  );
}

export function CharacterSeal() {
  return (
    <div className={styles.seal} aria-hidden="true">
      <svg viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="var(--background)"
          stroke="var(--frame-metal)"
          strokeWidth="3"
        />
        <circle
          cx="60"
          cy="60"
          r="46"
          fill="none"
          stroke="var(--frame-highlight)"
          strokeWidth=".6"
        />
        <circle
          cx="60"
          cy="60"
          r="39"
          fill="none"
          stroke="var(--frame-shadow)"
          strokeWidth="1"
        />
        <path
          d="M60 1 69 16 60 12 51 16ZM119 60 104 69 108 60 104 51ZM60 119 51 104 60 108 69 104ZM1 60 16 51 12 60 16 69Z"
          fill="var(--frame-metal)"
          stroke="var(--frame-highlight)"
          strokeWidth=".6"
        />
        <path
          d="M26 26 35 30 30 35ZM94 26 90 35 85 30ZM94 94 85 90 90 85ZM26 94 30 85 35 90Z"
          fill="var(--frame-highlight)"
        />
        <path
          d="M40 84 60 92 80 84M40 36 60 28 80 36"
          fill="none"
          stroke="var(--frame-metal)"
        />
      </svg>
      <span>JP</span>
    </div>
  );
}
