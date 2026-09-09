import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import puppeteer from "puppeteer";

const baseUrl = process.env.PORTFOLIO_BASE_URL ?? "http://127.0.0.1:3000";
const target = new URL(baseUrl);
assert.ok(
  ["localhost", "127.0.0.1", "[::1]"].includes(target.hostname),
  "Browser checks target a local server only",
);
const browser = await puppeteer.launch({ headless: true });
const errors = [];
const report = [];

try {
  const page = await browser.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.setViewport({ width: 1440, height: 1000, deviceScaleFactor: 1 });
  const response = await page.goto(baseUrl, { waitUntil: "networkidle0" });
  assert.equal(response.status(), 200);
  await page.waitForSelector("#project-search");
  assert.match(await page.title(), /Jeffery Patterson/);
  assert.equal(await page.$$eval("h1", (elements) => elements.length), 1);
  assert.equal(
    await page.$$eval(".featured-card", (elements) => elements.length),
    6,
  );
  const total = await page.$eval(
    '.category-filters button[aria-pressed="true"] span',
    (element) => Number(element.textContent),
  );
  assert.ok(total >= 60, "Expanded catalog is present");
  assert.equal(
    await page.$$eval("#projects .project-card", (elements) => elements.length),
    12,
  );
  assert.equal(
    await page.$eval(
      ".profile-image",
      (image) => image.complete && image.naturalWidth > 0,
    ),
    true,
  );
  assert.equal(
    await page.evaluate(() =>
      ["geistSans", "geistMono"].every((family) =>
        [...document.fonts].some(
          (font) => font.family === family && font.status === "loaded",
        ),
      ),
    ),
    true,
  );
  report.push(
    `Initial page: ${total} projects, six featured, profile image and local fonts loaded`,
  );

  async function clickButton(selector, label) {
    const buttons = await page.$$(selector);
    for (const button of buttons) {
      if (
        (await button.evaluate((element) => element.textContent)).includes(
          label,
        )
      ) {
        await button.click();
        return;
      }
    }
    throw new Error(`Button not found: ${label}`);
  }

  async function search(query) {
    await page.$eval("#project-search", (input) => input.focus());
    // Native select() handles macOS and Linux consistently without platform modifier assumptions.
    await page.$eval("#project-search", (input) => input.select());
    await page.keyboard.press("Backspace");
    if (query) await page.type("#project-search", query);
  }

  await search("  fAtHoM  ");
  await page.waitForFunction(
    () => document.querySelectorAll("#projects .project-card").length === 2,
  );
  assert.ok(
    (
      await page.$$eval("#projects h3", (elements) =>
        elements.map((element) => element.textContent),
      )
    ).every((name) => name.includes("Fathom")),
  );
  await search("google oauth");
  await page.waitForFunction(() =>
    [...document.querySelectorAll("#projects h3")].some(
      (element) => element.textContent === "Google Docs MCP Server",
    ),
  );
  await clickButton(".text-button", "Clear filters");
  await page.select("#project-kind", "Internal Tool");
  await page.select("#project-technology", "Python");
  await clickButton(".category-filters button", "Operations");
  await page.waitForFunction(
    () => document.querySelectorAll("#projects .project-card").length > 0,
  );
  const combined = await page.$$eval("#projects .project-card", (cards) =>
    cards.map((card) => ({
      category: card.dataset.category,
      kind: card.querySelector(".project-kind").textContent,
      tags: [...card.querySelectorAll(".project-tags li")].map(
        (tag) => tag.textContent,
      ),
    })),
  );
  assert.ok(
    combined.every(
      (card) =>
        card.category === "Operations" &&
        card.kind === "Internal Tool" &&
        card.tags.includes("Python"),
    ),
  );
  await search("zzzz-no-such-project-zzzz");
  await page.waitForSelector(".empty-state");
  assert.equal(
    await page.$eval('[role="status"]', (element) => element.textContent),
    "No matching projects",
  );
  await clickButton(".empty-state button", "Show all projects");
  await page.waitForFunction(
    () => document.querySelectorAll("#projects .project-card").length === 12,
  );
  assert.equal(
    await page.$eval("#project-kind", (element) => element.value),
    "All",
  );
  report.push(
    "Search, combined filters, empty-state recovery, and reset passed",
  );

  while (await page.$(".load-more button")) {
    const before = await page.$$eval(
      "#projects .project-card",
      (elements) => elements.length,
    );
    await page.click(".load-more button");
    await page.waitForFunction(
      (count) =>
        document.querySelectorAll("#projects .project-card").length > count,
      {},
      before,
    );
  }
  const allSlugs = await page.$$eval("#projects .project-card", (cards) =>
    cards.map((card) => card.dataset.project),
  );
  assert.equal(allSlugs.length, total);
  assert.equal(new Set(allSlugs).size, total);
  await clickButton(".category-filters button", "Developer Tools");
  await page.waitForFunction(() =>
    [...document.querySelectorAll("#projects .project-card")].every(
      (card) => card.dataset.category === "Developer Tools",
    ),
  );
  assert.ok(
    (await page.$$eval(
      "#projects .project-card",
      (elements) => elements.length,
    )) <= 12,
  );
  report.push(
    "Pagination reaches every project without duplicates and resets on filter changes",
  );

  await clickButton(".text-button", "Clear filters");
  const anchors = await page.$$eval('a[href^="#"]', (links) =>
    links.map((link) => link.getAttribute("href")),
  );
  for (const anchor of anchors)
    assert.ok(await page.$(anchor), `Missing section ${anchor}`);
  const insecureLinks = await page.$$eval(
    'a[target="_blank"]',
    (links) =>
      links.filter(
        (link) =>
          !link.rel.includes("noopener") || !link.rel.includes("noreferrer"),
      ).length,
  );
  assert.equal(insecureLinks, 0);
  await page.goto(baseUrl, { waitUntil: "networkidle0" });
  await page.keyboard.press("Tab");
  assert.equal(
    await page.evaluate(() => document.activeElement.textContent),
    "Skip to content",
  );
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(() => location.hash), "#main");
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "reduce" },
  ]);
  assert.equal(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
    "auto",
  );
  report.push(
    "Section anchors, external-link attributes, keyboard skip link, and reduced motion passed",
  );

  const screenshotDirectory = process.env.PORTFOLIO_SCREENSHOT_DIR;
  if (screenshotDirectory)
    await mkdir(screenshotDirectory, { recursive: true });
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewport({ width, height: 1000, deviceScaleFactor: 1 });
    await page.evaluate(() => window.scrollTo(0, 0));
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `Horizontal overflow at ${width}px`,
    );
    if (screenshotDirectory && [390, 1440].includes(width)) {
      await page.screenshot({
        path: `${screenshotDirectory}/portfolio-${width}.png`,
        fullPage: true,
      });
      if (width === 1440)
        await page.screenshot({
          path: `${screenshotDirectory}/portfolio-desktop.png`,
        });
    }
  }
  report.push("No horizontal overflow at 320, 390, 768, 1024, or 1440px");
  assert.deepEqual(errors, [], "No browser runtime or console errors");
  console.log(report.join("\n"));
} finally {
  await browser.close();
}
