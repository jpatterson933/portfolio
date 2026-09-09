import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import puppeteer from "puppeteer";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const { values } = parseArgs({ options: { output: { type: "string" } } });
const outputPath = values.output
  ? path.resolve(values.output)
  : path.join(projectRoot, "Jeffery_Patterson_Resume.pdf");

// Keep employment dates explicit. Project work does not imply a new employer.
const experience = [
  {
    role: "Full Stack Engineer",
    company: "AE Studio",
    location: "Los Angeles, CA",
    dates: "Aug 2023 - Present",
    bullets: [
      "Build client platforms and internal tools across education, AI, and business operations, from React interfaces and APIs to databases and deployment.",
      "Developed a QTI 3.0 assessment API with bidirectional JSON/XML conversion, schema validation, student-response processing, and multi-tenant MongoDB storage.",
      "Built a cross-platform command launcher with a shared plugin system and service integrations across Electron desktop, Capacitor mobile, and web applications.",
      "Implemented PostgreSQL and MongoDB services, Redis caching, background jobs, and webhook pipelines to connect applications and automate team workflows.",
      "Created dashboards and developer tools for website audits, traffic analysis, and build inspection; deployed applications on AWS and Railway.",
    ],
  },
  {
    role: "Full Stack Development Teaching Assistant",
    company: "UC San Diego & edX",
    location: "Remote",
    dates: "Feb 2023 - Aug 2023",
    bullets: [
      "Mentored 30+ students in React, Node.js, Express, and databases; guided projects from concept to deployment through debugging, code review, and Git workflows.",
    ],
  },
];

const projects = [
  {
    name: "aiseo-audit",
    label: "Open source",
    url: "https://github.com/agencyenterprise/aiseo-audit",
    description:
      "Built a deterministic CLI and typed API that evaluate AI search readiness and produce actionable reports without AI API calls.",
  },
  {
    name: "Fathom MCP Server",
    label: "Open source",
    url: "https://github.com/agencyenterprise/fathom-mcp-server",
    description:
      "Connected AI assistants to meeting recordings, transcripts, and summaries through Model Context Protocol, with OAuth, encrypted tokens, and per-user access controls.",
  },
  {
    name: "Fabulist",
    label: "Desktop application",
    description:
      "Built a writing workspace with Markdown editing, anchored comments, reviewable AI edits, Git history, and reusable agent plugins.",
  },
];

const skills = [
  ["Languages", "TypeScript, JavaScript, Python, C#, SQL, HTML, CSS"],
  [
    "Applications",
    "React, Next.js, Node.js, Express, ASP.NET Core, Electron, Capacitor",
  ],
  [
    "Data & AI",
    "PostgreSQL, MongoDB, Redis, Drizzle ORM, BullMQ, OpenAI, Anthropic, MCP",
  ],
  [
    "Delivery",
    "AWS, Docker, Railway, GitHub Actions, Git, Vitest, Zod, k6, OAuth 2.0",
  ],
];

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character]!,
  );
}

async function generateResume(): Promise<void> {
  const font = await readFile(
    path.join(projectRoot, "src/app/fonts/GeistVF.woff"),
  );
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Jeffery Patterson | Software Engineer</title>
<style>
  @font-face { font-family: Geist; src: url(data:font/woff;base64,${font.toString("base64")}) format("woff"); font-weight: 100 900; font-style: normal; }
  @page { size: Letter; margin: 0; }
  * { box-sizing: border-box; }
  body { margin: 0; color: #202b33; font: 10pt/1.3 Geist, Arial, sans-serif; font-variant-ligatures: none; }
  main { width: 8.5in; padding: 0.43in 0.5in 0.4in; }
  a { color: inherit; text-decoration: none; }
  h1, h2, h3, p { margin: 0; }
  h1 { font-size: 25pt; line-height: 1.05; font-weight: 700; letter-spacing: -0.8pt; }
  .title { margin-top: 5pt; font-size: 11pt; color: #365765; font-weight: 550; }
  .contact { margin-top: 7pt; font-size: 9pt; color: #43515a; }
  .links { margin-top: 3pt; font-size: 9pt; color: #43515a; }
  .contact span + span::before, .links a + a::before { content: " / "; color: #98a4ab; padding: 0 6pt; }
  .summary { margin-top: 11pt; padding-top: 10pt; border-top: 1.5pt solid #365765; }
  section { margin-top: 8pt; }
  h2 { margin-bottom: 7pt; padding-bottom: 4pt; border-bottom: 0.5pt solid #cbd2d6; color: #365765; font-size: 9pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2pt; }
  article { break-inside: avoid; }
  article + article { margin-top: 7pt; }
  .job-heading { display: flex; justify-content: space-between; align-items: baseline; gap: 12pt; }
  h3 { font-size: 10.5pt; font-weight: 650; }
  .dates { flex-shrink: 0; font-size: 9pt; color: #52616b; }
  .company { margin-top: 1pt; font-size: 9.5pt; }
  .company strong { font-weight: 650; }
  ul { margin: 4pt 0 0; padding-left: 12pt; }
  li { padding-left: 1pt; margin-top: 3pt; }
  .project-heading { display: flex; align-items: baseline; gap: 7pt; }
  .project-label { color: #52616b; font-size: 8.5pt; }
  .project p { margin-top: 2pt; }
  .skills p + p { margin-top: 3pt; }
  .skills strong { display: inline-block; width: 76pt; font-weight: 650; }
  .education p { font-size: 9pt; }
  .education p + p { margin-top: 3pt; }
</style>
</head>
<body>
<main>
  <header>
    <h1>Jeffery Patterson</h1>
    <p class="title">Software Engineer | Full-stack applications, AI integrations & developer tools</p>
    <p class="contact"><span>Los Angeles, CA</span><span><a href="mailto:designframebuildweb@gmail.com">designframebuildweb@gmail.com</a></span><span><a href="tel:+19515816263">951-581-6263</a></span></p>
    <p class="links"><a href="https://github.com/jpatterson933">github.com/jpatterson933</a><a href="https://www.linkedin.com/in/jefferywpatterson/">linkedin.com/in/jefferywpatterson</a><a href="https://portfolio-production-c6b6.up.railway.app/">Portfolio</a></p>
  </header>
  <p class="summary">Full-stack engineer at AE Studio building web platforms, desktop apps, and AI integrations. Experience spans assessment systems, workflow automation, and open source developer tools.</p>
  <section aria-label="Experience">
    <h2>Experience</h2>
    ${experience
      .map(
        (job) => `<article>
      <div class="job-heading"><h3>${escapeHtml(job.role)}</h3><span class="dates">${escapeHtml(job.dates)}</span></div>
      <p class="company"><strong>${escapeHtml(job.company)}</strong> | ${escapeHtml(job.location)}</p>
      <ul>${job.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("")}</ul>
    </article>`,
      )
      .join("")}
  </section>
  <section aria-label="Selected projects">
    <h2>Selected Projects</h2>
    ${projects
      .map(
        (project) => `<article class="project">
      <div class="project-heading"><h3>${project.url ? `<a href="${escapeHtml(project.url)}">${escapeHtml(project.name)}</a>` : escapeHtml(project.name)}</h3><span class="project-label">${escapeHtml(project.label)}</span></div>
      <p>${escapeHtml(project.description)}</p>
    </article>`,
      )
      .join("")}
  </section>
  <section class="skills" aria-label="Technical skills">
    <h2>Technical Skills</h2>
    ${skills.map(([label, value]) => `<p><strong>${escapeHtml(label)}</strong>${escapeHtml(value)}</p>`).join("")}
  </section>
  <section class="education" aria-label="Education">
    <h2>Education</h2>
    <p><strong>UCLA</strong>, B.A. Political Science (2016) | <strong>Santa Monica College</strong>, A.S. Computer Science (2022)</p>
    <p><strong>UCLA Extension</strong>, Full Stack Developer Bootcamp (2021); Cybersecurity Certificate (2023)</p>
  </section>
</main>
</body>
</html>`;

  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 816, height: 1056, deviceScaleFactor: 1 });
    // All assets are embedded. Generation works without network access.
    await page.setRequestInterception(true);
    page.on("request", (request) => {
      if (/^https?:/.test(request.url())) void request.abort();
      else void request.continue();
    });
    await page.emulateMediaType("print");
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    const layout = await page.evaluate(() => ({
      height: document.querySelector("main")!.getBoundingClientRect().height,
      width: document.documentElement.scrollWidth,
      fontLoaded: document.fonts.check("10pt Geist"),
    }));
    if (!layout.fontLoaded)
      throw new Error("The bundled resume font did not load.");
    if (layout.height > 1056 || layout.width > 816) {
      throw new Error(
        `Resume exceeds one Letter page (${Math.ceil(layout.height)}px tall, ${layout.width}px wide). Shorten the content before generating.`,
      );
    }
    const pdf = await page.pdf({
      format: "Letter",
      preferCSSPageSize: true,
      printBackground: true,
      tagged: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    await mkdir(path.dirname(outputPath), { recursive: true });
    // Replace only after layout validation and a complete PDF render.
    const temporaryPath = `${outputPath}.${process.pid}.tmp`;
    await writeFile(temporaryPath, pdf);
    await rename(temporaryPath, outputPath);
    console.log(`One-page resume generated: ${outputPath}`);
    console.log(
      `Layout: ${Math.ceil(layout.height)} / 1056px; embedded local font; selectable text.`,
    );
  } finally {
    await browser.close();
  }
}

generateResume().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
