"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import type { CharacterStats } from "./schema";
import { animateStats } from "./animation";
import { CharacterFrame, CharacterSeal } from "./CharacterFrame";
import styles from "./character-stats.module.css";

export function CharacterSheet({
  stats,
  onClose,
}: {
  stats: CharacterStats;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const sheet = sheetRef.current;
    if (!dialog || !sheet) return;
    dialog.showModal();
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const stop = animateStats(sheet);
    return () => {
      stop();
      document.body.style.overflow = previousOverflow;
      dialog.close();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="character-title"
      aria-describedby="character-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div ref={sheetRef} className={styles.sheet} data-character-card>
        <CharacterFrame />
        <header className={styles.header}>
          <p className={styles.cardTitle}>Character</p>
          <button
            ref={closeRef}
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label="Close character stats"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </header>
        <div className={styles.identity}>
          <CharacterSeal />
          <div className={styles.identityText}>
            <h2 id="character-title">{stats.name}</h2>
            <p className={styles.characterClass}>Software engineer</p>
            <p id="character-description" className={styles.subtitle}>
              {stats.location}
            </p>
          </div>
          <div className={styles.projectCount}>
            <span>Project archive</span>
            <strong data-count={stats.projectCount} aria-hidden="true">
              {stats.projectCount}
            </strong>
            <span className="sr-only">{stats.projectCount}</span>
            <small>projects & tools</small>
          </div>
        </div>
        <div className={styles.display}>
          <section
            className={styles.attributes}
            aria-labelledby="attribute-heading"
          >
            <div className={styles.panelHeading}>
              <div>
                <h3 id="attribute-heading">Core attributes</h3>
              </div>
              <span className={styles.xpLabel}>Experience</span>
            </div>
            <p className={styles.panelCaption}>Projects by discipline</p>
            <div className={styles.attributeList}>
              {stats.attributes.map((attribute, index) => (
                <div
                  className={styles.attribute}
                  key={attribute.name}
                  data-attribute={attribute.name}
                  style={
                    {
                      "--stat-fill": `${attribute.progress * 100}%`,
                      "--delay": `${180 + index * 110}ms`,
                      "--flow-delay": `${-index * 1.15}s`,
                    } as CSSProperties
                  }
                >
                  <div className={styles.attributeLabel}>
                    <span>{attribute.name}</span>
                    <strong
                      className={styles.statNumber}
                      data-count={attribute.count}
                      data-delay={180 + index * 110}
                      aria-hidden="true"
                    >
                      {String(attribute.count).padStart(2, "0")}
                    </strong>
                  </div>
                  <div className={styles.vessel} aria-hidden="true">
                    <div className={styles.liquid} data-liquid>
                      <div className={styles.liquidBody} />
                      <span className={styles.liquidLight} />
                      <span className={styles.bubbles}>
                        {[6, 9, 4, 7, 5, 10, 4, 8, 5].map((size, bubble) => (
                          <i
                            key={bubble}
                            data-liquid-bubble
                            style={
                              {
                                left: `${6 + bubble * 10}%`,
                                "--bubble-size": `${size}px`,
                                "--orbit-radius": `${2 + (bubble % 3)}px`,
                                "--orbit-duration": `${3.5 + bubble * 0.47}s`,
                                "--orbit-delay": `${-bubble * 0.83 - index * 0.61}s`,
                              } as CSSProperties
                            }
                          />
                        ))}
                      </span>
                    </div>
                    <span className={styles.vesselTicks} />
                    <span className={styles.glassShine} />
                  </div>
                  <span className="sr-only">
                    {attribute.count} {attribute.category} projects
                  </span>
                </div>
              ))}
            </div>
          </section>
          <section className={styles.loadout} aria-labelledby="loadout-heading">
            <div className={styles.panelHeading}>
              <div>
                <h3 id="loadout-heading">Equipped stack</h3>
              </div>
            </div>
            <p className={styles.panelCaption}>Most-used technologies</p>
            <ol className={styles.equipmentList}>
              {stats.equipment.map((item, index) => (
                <li key={item.name}>
                  <span className={styles.equipmentIcon} aria-hidden="true">
                    {["⌘", "◇", "{ }", "⊞", "λ", "⌁"][index]}
                  </span>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.count} projects</span>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>
        <footer className={styles.footer}>
          <div className={styles.inventory}>
            {[
              { value: stats.technologyCount, label: "Technologies" },
              { value: stats.openSourceCount, label: "Open source projects" },
              { value: stats.attributes.length, label: "Disciplines" },
            ].map(({ value, label }) => (
              <div key={label}>
                <strong data-count={value} data-delay={150} aria-hidden="true">
                  {value}
                </strong>
                <span className="sr-only">{value}</span>
                <span>{label}</span>
              </div>
            ))}
          </div>
          <p>
            Actual project counts. Bars scale to your most active discipline.
          </p>
        </footer>
      </div>
    </dialog>
  );
}
