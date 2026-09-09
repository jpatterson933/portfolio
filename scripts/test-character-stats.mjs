import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import puppeteer from "puppeteer";

const baseUrl = process.env.PORTFOLIO_BASE_URL ?? "http://127.0.0.1:3000";
assert.ok(
  ["localhost", "127.0.0.1", "[::1]"].includes(new URL(baseUrl).hostname),
);
const outputDirectory = process.env.PORTFOLIO_SCREENSHOT_DIR;
if (outputDirectory) await mkdir(outputDirectory, { recursive: true });
const browser = await puppeteer.launch({ headless: true });
const trigger = 'button[aria-haspopup="dialog"]';
const close = 'button[aria-label="Close character stats"]';
try {
  const page = await browser.newPage();
  const errors = [],
    requests = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => requests.push(request.url()));
  await page.setViewport({ width: 1440, height: 1050, deviceScaleFactor: 1 });
  await page.goto(baseUrl, { waitUntil: "networkidle0" });
  assert.equal(await page.$("[data-character-card]"), null);
  await page.click(trigger);
  await page.waitForSelector("dialog[open]");
  assert.equal(
    await page.$eval("#character-title", (element) => element.textContent),
    "Jeffery Patterson",
  );
  assert.equal(await page.$("canvas"), null, "No hologram renderer remains");
  assert.equal(
    await page.$$eval("dialog button", (elements) => elements.length),
    1,
  );
  assert.equal(
    await page.$$eval("[data-liquid]", (elements) => elements.length),
    7,
  );
  assert.equal(
    await page.evaluate(() =>
      document.activeElement.getAttribute("aria-label"),
    ),
    "Close character stats",
  );
  // Capture the fill in progress, then prove it reaches its final value.
  const moving = await page.$eval(
    '[data-attribute="Exploration"] [data-liquid]',
    (element) => getComputedStyle(element).transform,
  );
  assert.notEqual(moving, "matrix(1, 0, 0, 1, 0, 0)");
  await page.waitForFunction(() =>
    [...document.querySelectorAll("[data-count]")].every(
      (element) =>
        Number(element.textContent) === Number(element.dataset.count),
    ),
  );
  await page.waitForFunction(() =>
    [...document.querySelectorAll("[data-liquid]")].every(
      (element) =>
        getComputedStyle(element).transform === "matrix(1, 0, 0, 1, 0, 0)",
    ),
  );
  assert.ok(
    await page.$eval("dialog", (element) =>
      element.textContent.includes("15 Operations projects"),
    ),
  );
  assert.equal(
    await page.$eval('[data-count="61"]', (element) => element.textContent),
    "61",
  );
  assert.ok(
    await page.$eval(
      '[data-attribute="Systems"] [data-liquid]',
      (element) =>
        Math.abs(
          element.getBoundingClientRect().width /
            element.parentElement.clientWidth -
            7 / 15,
        ) < 0.01,
    ),
  );
  if (outputDirectory)
    await page.screenshot({ path: `${outputDirectory}/character-desktop.png` });
  assert.equal(
    await page.$$eval("[data-liquid-bubble]", (elements) => elements.length),
    63,
  );
  assert.equal(await page.$("[data-card-atmosphere]"), null);
  assert.equal(
    await page.$$eval(
      "[data-liquid]",
      (elements) =>
        new Set(elements.map((element) => getComputedStyle(element).color))
          .size,
    ),
    1,
    "All experience bars share one semantic color",
  );
  assert.ok(
    await page.$eval("[data-liquid-bubble]", (element) =>
      element
        .getAnimations()
        .some(
          (animation) =>
            animation.effect.getTiming().iterations === Infinity &&
            animation.playState === "running",
        ),
    ),
  );
  // Sample the same point on consecutive revolutions: position and lighting must match.
  const seam = await page.$eval("[data-liquid-bubble]", (element) => {
    const animation = element.getAnimations()[0];
    const duration = Number(animation.effect.getTiming().duration);
    animation.pause();
    animation.currentTime = 1;
    const before = [
      ...new DOMMatrix(getComputedStyle(element).transform).toFloat64Array(),
    ];
    animation.currentTime = duration + 1;
    const after = [
      ...new DOMMatrix(getComputedStyle(element).transform).toFloat64Array(),
    ];
    animation.play();
    return Math.max(
      ...before.map((value, index) => Math.abs(value - after[index])),
    );
  });
  assert.ok(seam < 0.0001, "Bubble orbits loop without a position reset");
  await page.evaluate(() => {
    window.__cardAnimations = document
      .querySelector("[data-character-card]")
      .getAnimations({ subtree: true });
  });
  await page.keyboard.press("Escape");
  await page.waitForSelector("dialog", { hidden: true });
  assert.equal(
    await page.$eval(trigger, (element) => element === document.activeElement),
    true,
  );
  assert.equal(await page.evaluate(() => document.body.style.overflow), "");
  assert.equal(
    await page.evaluate(
      () =>
        window.__cardAnimations.filter(
          (animation) => animation.playState === "running",
        ).length,
    ),
    0,
  );
  for (let cycle = 0; cycle < 3; cycle++) {
    await page.click(trigger);
    await page.waitForSelector("dialog[open]");
    await page.click(close);
    await page.waitForSelector("dialog", { hidden: true });
  }
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.click(trigger);
  await page.waitForSelector("dialog[open]");
  assert.ok(
    await page.$$eval("[data-count]", (elements) =>
      elements.every(
        (element) =>
          Number(element.textContent) === Number(element.dataset.count),
      ),
    ),
  );
  assert.equal(
    await page.evaluate(
      () =>
        document
          .querySelector("[data-character-card]")
          .getAnimations({ subtree: true })
          .filter((animation) => animation.playState === "running").length,
    ),
    0,
  );
  for (const width of [320, 390, 768, 1024]) {
    await page.setViewport({ width, height: 844, deviceScaleFactor: 1 });
    assert.ok(
      await page.$eval(
        "dialog",
        (element) => element.scrollWidth <= element.clientWidth + 1,
      ),
      `No horizontal overflow at ${width}px`,
    );
    await page.$eval("dialog", (element) => {
      element.scrollTop = element.scrollHeight;
    });
    assert.ok(
      await page.$eval(
        "dialog footer",
        (element) =>
          element.getBoundingClientRect().bottom <= window.innerHeight,
      ),
    );
  }
  if (outputDirectory) {
    await page.setViewport({ width: 390, height: 1500, deviceScaleFactor: 1 });
    await page.$eval("dialog", (element) => {
      element.scrollTop = 0;
    });
    await page.screenshot({ path: `${outputDirectory}/character-mobile.png` });
  }
  assert.ok(
    !requests.some((url) =>
      /character-stats\/vendor|babylon|glslang|twgsl/.test(url),
    ),
  );
  assert.ok(
    !requests.some(
      (url) =>
        /^https?:/.test(url) && new URL(url).origin !== new URL(baseUrl).origin,
    ),
  );
  assert.deepEqual(errors, []);
  console.log(
    "Passed: animated fills and counters, accurate final values, proportional bars, modal focus and Escape, repeated open/close, mobile scrolling, reduced motion, and no external graphics assets.",
  );
} finally {
  await browser.close();
}
