import assert from "node:assert/strict";
import { mkdir, readdir, readFile } from "node:fs/promises";
import puppeteer from "puppeteer";

const baseUrl = process.env.PORTFOLIO_BASE_URL ?? "http://127.0.0.1:3000";
assert.ok(
  ["localhost", "127.0.0.1", "[::1]"].includes(new URL(baseUrl).hostname),
);
const outputDirectory = process.env.PORTFOLIO_SCREENSHOT_DIR;
if (outputDirectory) await mkdir(outputDirectory, { recursive: true });
const browser = await puppeteer.launch({ headless: true });
const reports = [];

try {
  const page = await browser.newPage();
  const errors = [];
  const requests = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => requests.push(request.url()));
  await page.evaluateOnNewDocument(() => {
    const pending = new Set();
    const request = window.requestAnimationFrame.bind(window);
    const cancel = window.cancelAnimationFrame.bind(window);
    window.requestAnimationFrame = (callback) => {
      const id = request((time) => {
        pending.delete(id);
        callback(time);
      });
      pending.add(id);
      return id;
    };
    window.cancelAnimationFrame = (id) => {
      pending.delete(id);
      cancel(id);
    };
    window.__pendingAnimationFrames = () => pending.size;
  });
  await page.setViewport({ width: 1440, height: 1050, deviceScaleFactor: 1 });
  await page.goto(baseUrl, { waitUntil: "networkidle0" });
  assert.equal(await page.$("canvas"), null);
  const chunks = await readdir(".next/static/chunks");
  const sceneChunks = [];
  for (const chunk of chunks.filter((file) => file.endsWith(".js"))) {
    if (
      (await readFile(`.next/static/chunks/${chunk}`, "utf8")).includes(
        "projection-camera",
      )
    )
      sceneChunks.push(chunk);
  }
  assert.ok(sceneChunks.length > 0);
  assert.ok(
    !requests.some((url) => sceneChunks.some((chunk) => url.endsWith(chunk))),
    "3D scene is not requested on initial page load",
  );
  const trigger = 'button[aria-haspopup="dialog"]';
  await page.click(trigger);
  await page.waitForSelector("dialog[open]");
  await page.waitForFunction(
    () =>
      document.querySelector("[data-character-status]")?.dataset
        .characterStatus === "ready",
    { timeout: 30000 },
  );
  const renderer = await page.$eval(
    "[data-renderer]",
    (element) => element.dataset.renderer,
  );
  assert.ok(["webgpu", "webgl"].includes(renderer));
  assert.equal(
    await page.$$eval("dialog canvas", (elements) => elements.length),
    1,
  );
  assert.equal(
    await page.$eval("#character-title", (element) => element.textContent),
    "Jeffery Patterson",
  );
  assert.equal(
    await page.$$eval("dialog button", (elements) => elements.length),
    1,
    "Close is the only sheet control",
  );
  assert.equal(
    await page.$eval("dialog", (element) =>
      element
        .querySelectorAll("section")[0]
        .textContent.includes("15 Operations projects"),
    ),
    true,
  );
  assert.equal(
    await page.evaluate(() =>
      document.activeElement.getAttribute("aria-label"),
    ),
    "Close character stats",
  );
  await page.keyboard.press("Tab");
  assert.ok(
    await page.evaluate(
      () =>
        document.activeElement.closest("dialog") !== null ||
        document.activeElement === document.body,
    ),
    "Keyboard stays inside the modal boundary",
  );
  const frameTimes = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const samples = [];
        let previous;
        function frame(now) {
          if (previous !== undefined) samples.push(now - previous);
          previous = now;
          if (samples.length < 120) requestAnimationFrame(frame);
          else resolve(samples);
        }
        requestAnimationFrame(frame);
      }),
  );
  const sorted = frameTimes.toSorted((a, b) => a - b);
  reports.push(
    `${renderer}: frame interval median ${sorted[60].toFixed(1)} ms; p95 ${sorted[114].toFixed(1)} ms (local test browser)`,
  );
  if (outputDirectory)
    await page.screenshot({ path: `${outputDirectory}/character-desktop.png` });
  assert.ok(
    !requests.some(
      (url) =>
        /^https?:/.test(url) && new URL(url).origin !== new URL(baseUrl).origin,
    ),
    "Graphics use no external CDN",
  );
  await page.keyboard.press("Escape");
  await page.waitForSelector("dialog", { hidden: true });
  await page.waitForFunction(() => window.__pendingAnimationFrames() === 0);
  assert.equal(await page.$("canvas"), null);
  assert.equal(
    await page.$eval(trigger, (element) => element === document.activeElement),
    true,
  );
  assert.equal(await page.evaluate(() => document.body.style.overflow), "");
  reports.push(
    "Lazy loading, local-only assets, real stats, modal focus, Escape, and GPU-loop cleanup passed",
  );

  for (let cycle = 0; cycle < 3; cycle++) {
    await page.click(trigger);
    await page.waitForSelector("dialog[open]");
    if (cycle > 0)
      await page.waitForFunction(
        () =>
          document.querySelector("[data-character-status]")?.dataset
            .characterStatus === "ready",
      );
    await page.click('button[aria-label="Close character stats"]');
    await page.waitForSelector("dialog", { hidden: true });
    await page.waitForFunction(() => window.__pendingAnimationFrames() === 0);
    assert.equal(await page.$$eval("canvas", (elements) => elements.length), 0);
  }
  reports.push(
    "Rapid close and repeated open/close release canvases and animation frames",
  );

  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  await page.setViewport({ width: 390, height: 1100, deviceScaleFactor: 1 });
  await page.click(trigger);
  await page.waitForFunction(
    () =>
      document.querySelector("[data-character-status]")?.dataset
        .characterStatus === "ready",
  );
  await page.waitForFunction(() => window.__pendingAnimationFrames() === 0);
  for (const width of [320, 390, 768]) {
    await page.setViewport({ width, height: 1100, deviceScaleFactor: 1 });
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    await page.waitForFunction(() => window.__pendingAnimationFrames() === 0);
    assert.ok(
      await page.$eval(
        "dialog",
        (element) => element.scrollWidth <= element.clientWidth + 1,
      ),
      `No sheet overflow at ${width}px`,
    );
    if (outputDirectory && width === 390)
      await page.screenshot({
        path: `${outputDirectory}/character-mobile.png`,
      });
  }
  await page.keyboard.press("Escape");
  reports.push("Mobile layout and reduced-motion static rendering passed");
  assert.deepEqual(errors, []);

  const webgl = await browser.newPage();
  const webglErrors = [];
  webgl.on("pageerror", (error) => webglErrors.push(error.message));
  await webgl.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "gpu", {
      value: undefined,
      configurable: true,
    });
  });
  await webgl.goto(baseUrl, { waitUntil: "networkidle0" });
  await webgl.click(trigger);
  await webgl.waitForFunction(
    () =>
      document.querySelector("[data-character-status]")?.dataset
        .characterStatus === "ready",
    { timeout: 30000 },
  );
  assert.equal(
    await webgl.$eval("[data-renderer]", (element) => element.dataset.renderer),
    "webgl",
  );
  if (outputDirectory)
    await webgl.screenshot({ path: `${outputDirectory}/character-webgl.png` });
  assert.deepEqual(webglErrors, []);
  await webgl.close();
  reports.push("WebGL renders the scene when WebGPU is unavailable");

  const fallback = await browser.newPage();
  await fallback.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "gpu", {
      value: undefined,
      configurable: true,
    });
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (["webgl", "webgl2", "experimental-webgl", "webgpu"].includes(type))
        return null;
      return original.call(this, type, ...args);
    };
  });
  await fallback.goto(baseUrl, { waitUntil: "networkidle0" });
  await fallback.click(trigger);
  await fallback.waitForFunction(
    () =>
      document.querySelector("[data-character-status]")?.dataset
        .characterStatus === "fallback",
    { timeout: 30000 },
  );
  assert.equal(
    await fallback.$eval("#character-title", (element) => element.textContent),
    "Jeffery Patterson",
  );
  assert.ok(
    await fallback.$eval("dialog", (element) =>
      element.textContent.includes("Core attributes"),
    ),
  );
  assert.equal(await fallback.$("canvas"), null);
  await fallback.keyboard.press("Escape");
  reports.push("Unavailable graphics gracefully preserve the stat sheet");
  console.log(reports.join("\n"));
} finally {
  await browser.close();
}
