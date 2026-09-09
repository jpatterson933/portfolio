"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import type { CharacterStats, HologramController } from "./schema";
import styles from "./character-stats.module.css";

export function CharacterSheet({
  stats,
  onClose,
}: {
  stats: CharacterStats;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">(
    "loading",
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    const host = stageRef.current;
    if (!dialog || !host) return;
    dialog.showModal();
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const abort = new AbortController();
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let controller: HologramController | undefined;
    // An unavailable GPU never prevents reading the character sheet.
    const timeout = window.setTimeout(() => {
      setStatus("fallback");
      abort.abort();
    }, 20000);
    const syncMotion = () => controller?.setMotion(!preference.matches);
    preference.addEventListener("change", syncMotion);
    void import("./scene")
      .then(({ createHologram }) =>
        createHologram(host, {
          signal: abort.signal,
          motion: !preference.matches,
          quality: "auto",
          onReady() {
            window.clearTimeout(timeout);
            if (!abort.signal.aborted) setStatus("ready");
          },
          onFailure() {
            if (!abort.signal.aborted) {
              setStatus("fallback");
              abort.abort();
            }
          },
        }),
      )
      .then((instance) => {
        if (abort.signal.aborted) instance.dispose();
        else {
          controller = instance;
          syncMotion();
        }
      })
      .catch(() => {
        if (!abort.signal.aborted) {
          window.clearTimeout(timeout);
          setStatus("fallback");
        }
      });
    return () => {
      window.clearTimeout(timeout);
      preference.removeEventListener("change", syncMotion);
      abort.abort();
      controller?.dispose();
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
      <div className={styles.sheet} data-character-status={status}>
        <div className={styles.cornerTop} aria-hidden="true" />
        <header className={styles.header}>
          <div className={styles.systemLabel}>
            <span /> Character profile{" "}
            <span className={styles.headerDivider}>/</span> JP—001
          </div>
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
          <p className={styles.overline}>Class / Software engineer</p>
          <h2 id="character-title">{stats.name}</h2>
          <p id="character-description" className={styles.subtitle}>
            A character sheet built from the work. <span>{stats.location}</span>
          </p>
        </div>
        <div className={styles.display}>
          <section
            className={`${styles.panel} ${styles.attributes}`}
            aria-labelledby="attribute-heading"
          >
            <div className={styles.panelHeading}>
              <h3 id="attribute-heading">Core attributes</h3>
              <span>01</span>
            </div>
            <p className={styles.panelCaption}>Projects by discipline</p>
            <div className={styles.attributeList}>
              {stats.attributes.map((attribute, index) => (
                <div
                  className={styles.attribute}
                  key={attribute.name}
                  style={
                    {
                      "--stat-fill": `${attribute.progress * 100}%`,
                    } as CSSProperties
                  }
                >
                  <div className={styles.attributeLabel}>
                    <span>
                      <small>{String(index + 1).padStart(2, "0")}</small>
                      {attribute.name}
                    </span>
                    <strong>{String(attribute.count).padStart(2, "0")}</strong>
                  </div>
                  <div className={styles.statTrack} aria-hidden="true">
                    <div />
                  </div>
                  <span className="sr-only">
                    {attribute.count} {attribute.category} projects
                  </span>
                </div>
              ))}
            </div>
          </section>
          <div className={styles.projection}>
            <div className={styles.stage} ref={stageRef} aria-hidden="true" />
            {status !== "ready" && (
              <div className={styles.projectionFallback} aria-hidden="true">
                <div className={styles.fallbackOrb}>
                  <span>JP</span>
                </div>
              </div>
            )}
            <div className={styles.projectionLabel}>
              <span className={styles.signalDot} />
              {status === "loading" ? "Forming projection" : "The builder"}
            </div>
            <div className={styles.projectCount}>
              <span>Project archive</span>
              <strong>{stats.projectCount.toString().padStart(2, "0")}</strong>
              <small>projects & tools</small>
            </div>
          </div>
          <section
            className={`${styles.panel} ${styles.loadout}`}
            aria-labelledby="loadout-heading"
          >
            <div className={styles.panelHeading}>
              <h3 id="loadout-heading">Equipped stack</h3>
              <span>02</span>
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
                  <span className={styles.equipmentMark} aria-hidden="true">
                    ▪
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>
        <footer className={styles.footer}>
          <div className={styles.inventory}>
            <div>
              <strong>{stats.technologyCount}</strong>
              <span>Technologies</span>
            </div>
            <div>
              <strong>{stats.openSourceCount}</strong>
              <span>Open source projects</span>
            </div>
            <div>
              <strong>{stats.attributes.length}</strong>
              <span>Disciplines</span>
            </div>
          </div>
          <p>
            Actual project counts.
            <br />
            Bars scale to your most active discipline.
          </p>
        </footer>
        <div className={styles.cornerBottom} aria-hidden="true" />
      </div>
    </dialog>
  );
}
