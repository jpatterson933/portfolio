import path from "path";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  html {
    font-size: 10.5px;
    line-height: 1.35;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: #1a1a1a;
  }

  body { padding: 36px 40px 28px 40px; }

  a { color: #1a1a1a; text-decoration: none; }

  /* ---- Header ---- */
  .header { margin-bottom: 10px; }
  .header h1 { font-size: 20px; font-weight: 700; letter-spacing: -0.3px; margin-bottom: 1px; }
  .header .title { font-size: 11.5px; font-weight: 500; color: #444; margin-bottom: 4px; }
  .header .contact { font-size: 9.5px; color: #555; display: flex; flex-wrap: wrap; gap: 4px 12px; }
  .header .contact a { color: #555; }

  .divider { border: none; border-top: 1.5px solid #222; margin: 8px 0; }
  .divider-light { border: none; border-top: 1px solid #ddd; margin: 6px 0; }

  /* ---- Summary ---- */
  .summary { font-size: 10px; color: #333; margin-bottom: 8px; line-height: 1.4; }

  /* ---- Section ---- */
  .section-title {
    font-size: 10.5px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #1a1a1a;
    margin-bottom: 5px;
  }

  /* ---- Skills Grid ---- */
  .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 24px; margin-bottom: 8px; }
  .skill-row { font-size: 9.5px; display: flex; }
  .skill-label { font-weight: 600; min-width: 120px; color: #333; }
  .skill-value { color: #555; }

  /* ---- Experience ---- */
  .job { margin-bottom: 7px; }
  .job-header { display: flex; justify-content: space-between; align-items: baseline; }
  .job-title { font-size: 10.5px; font-weight: 600; }
  .job-date { font-size: 9px; color: #666; white-space: nowrap; }
  .job-company { font-size: 9.5px; color: #555; margin-bottom: 2px; }
  .job ul { padding-left: 14px; }
  .job li { font-size: 9.5px; color: #333; margin-bottom: 1px; line-height: 1.35; }

  /* ---- Projects ---- */
  .projects-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 16px; margin-bottom: 8px; }
  .project { }
  .project-name { font-size: 10px; font-weight: 600; }
  .project-desc { font-size: 9px; color: #444; line-height: 1.35; }
  .project-tech { font-size: 8.5px; color: #777; margin-top: 1px; }

  /* ---- Education ---- */
  .edu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px 24px; margin-bottom: 4px; }
  .edu-item { font-size: 9.5px; color: #333; }
  .edu-item strong { font-weight: 600; }
  .edu-item .edu-date { color: #777; font-size: 9px; }

  .cert { font-size: 9.5px; color: #333; }
</style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <h1>Jeffery Patterson</h1>
    <div class="title">Software Engineer · Los Angeles, California</div>
    <div class="contact">
      <span>designframebuildweb@gmail.com</span>
      <span>·</span>
      <span>951-581-6263</span>
      <span>·</span>
      <a href="https://github.com/jpatterson933">github.com/jpatterson933</a>
      <span>·</span>
      <a href="https://www.linkedin.com/in/jefferywpatterson/">linkedin.com/in/jefferywpatterson</a>
      <span>·</span>
      <a href="https://portfolio-production-c6b6.up.railway.app/">https://portfolio-production-c6b6.up.railway.app</a>
    </div>
  </div>

  <hr class="divider" />

  <!-- Summary -->
  <div class="summary">
    Full-stack engineer with 4+ years of professional experience building scalable web applications, RESTful APIs, data visualization tools, and cross-platform desktop and mobile apps. Lifelong Lakers fan, been watching every game since Kobe's rookie year, with a deep curiosity about basketball analytics and the factors that drive organizational success in the NBA. Rapid learner who thrives on picking up new languages and frameworks to meet the needs of the team.
  </div>

  <!-- Skills -->
  <div class="section-title">Technical Skills</div>
  <div class="skills-grid">
    <div class="skill-row"><span class="skill-label">Languages</span><span class="skill-value">TypeScript, JavaScript, Python, C#, SQL, HTML, CSS</span></div>
    <div class="skill-row"><span class="skill-label">Frontend</span><span class="skill-value">React, Next.js, Vue (familiar), Tailwind CSS, TanStack, HTML5 Canvas</span></div>
    <div class="skill-row"><span class="skill-label">Backend</span><span class="skill-value">Node.js, Express, ASP.NET Core, REST APIs, BullMQ, Redis</span></div>
    <div class="skill-row"><span class="skill-label">Databases</span><span class="skill-value">PostgreSQL, MongoDB, Drizzle ORM, Prisma, Entity Framework Core</span></div>
    <div class="skill-row"><span class="skill-label">Cloud &amp; DevOps</span><span class="skill-value">AWS, Docker, Railway, GitHub Actions, CI/CD, Sentry</span></div>
    <div class="skill-row"><span class="skill-label">Mobile / Desktop</span><span class="skill-value">Electron, Capacitor (iOS &amp; Android), cross-platform deployment</span></div>
    <div class="skill-row"><span class="skill-label">Data &amp; Analytics</span><span class="skill-value">pgvector, k6 / Grafana, Lighthouse CI, OpenAI, Anthropic, LangChain</span></div>
    <div class="skill-row"><span class="skill-label">Tooling</span><span class="skill-value">Git, Zod, Commander, Vitest, tsup, GraphQL, OAuth 2.0, MCP</span></div>
  </div>

  <hr class="divider-light" />

  <!-- Experience -->
  <div class="section-title">Experience</div>

  <div class="job">
    <div class="job-header">
      <span class="job-title">Full Stack Engineer</span>
      <span class="job-date">Aug 2023 - Present</span>
    </div>
    <div class="job-company">AE Studio · Los Angeles, CA</div>
    <ul>
      <li>Built and maintained internal web applications and client-facing platforms including data dashboards, assessment engines, webhook pipelines, and automation tooling</li>
      <li>Developed a cross-platform launcher (Electron desktop + Capacitor iOS/Android) with 50+ plugin integrations, demonstrating mobile and desktop deployment capability</li>
      <li>Architected a QTI 3.0-compliant assessment API with bidirectional JSON↔XML pipelines, load-tested to 5,000 virtual users via k6/Grafana, serving real students across the US in production</li>
      <li>Created data visualization and analytics tooling including bundle heat-maps, SEO/traffic dashboards, and AI-powered audit CLIs, turning raw data into actionable insights</li>
      <li>Implemented RESTful services backed by PostgreSQL and MongoDB with Redis caching, Drizzle ORM, and cloud deployment on AWS and Railway</li>
    </ul>
  </div>

  <div class="job">
    <div class="job-header">
      <span class="job-title">Full Stack Development Teaching Assistant</span>
      <span class="job-date">Feb 2023 - Aug 2023</span>
    </div>
    <div class="job-company">UC San Diego &amp; edX · Remote</div>
    <ul>
      <li>Mentored 30+ students through full-stack curriculum (React, Node.js, Express, MongoDB, MySQL, REST APIs) in an intensive bootcamp environment</li>
      <li>Guided students from concept to deployed web applications, reinforcing code review practices and Git workflows</li>
    </ul>
  </div>

  <hr class="divider-light" />

  <!-- Select Projects -->
  <div class="section-title">Select Projects</div>
  <div class="projects-grid">
    <div class="project">
      <div class="project-name">Universal Launcher</div>
      <div class="project-desc">Cross-platform launcher deployed as Electron desktop app (Mac/Windows) and Capacitor mobile app (iOS/Android) with 50+ plugin integrations across Linear, Slack, GitHub, Notion, and Spotify.</div>
      <div class="project-tech">React · TypeScript · Node.js · MongoDB · Electron · Capacitor</div>
    </div>
    <div class="project">
      <div class="project-name">NBA Twitter Bot</div>
      <div class="project-desc">Automated bot aggregating NBA news from 10+ sources via Perplexity AI, using OpenAI embeddings with cosine similarity for duplicate detection and GPT-4 for content generation.</div>
      <div class="project-tech">Python · OpenAI · Perplexity AI · scikit-learn · Selenium</div>
    </div>
    <div class="project">
      <div class="project-name">Timeback: QTI Assessment Engine</div>
      <div class="project-desc">Production assessment API with bidirectional JSON↔XML pipelines across 17 interaction types, XSD validation, and multi-tenant MongoDB storage. Load-tested to 5,000 VUs.</div>
      <div class="project-tech">TypeScript · Node.js · Express · MongoDB · k6 · Grafana</div>
    </div>
    <div class="project">
      <div class="project-name">aiseo-audit (Open Source)</div>
      <div class="project-desc">Deterministic CLI auditing web pages for AI search readiness across 7 categories and 30+ factors. Ships as both a CLI and typed API with JSON, Markdown, and HTML output.</div>
      <div class="project-tech">TypeScript · Node.js · NLP · cheerio · Zod · Vitest</div>
    </div>
  </div>

  <hr class="divider-light" />

  <!-- Education -->
  <div class="section-title">Education</div>
  <div class="edu-grid">
    <div class="edu-item"><strong>UCLA</strong>, B.A. Political Science <span class="edu-date">(2013 - 2016)</span></div>
    <div class="edu-item"><strong>UCLA Extension</strong>, Cybersecurity Certificate <span class="edu-date">(2022 - 2023)</span></div>
    <div class="edu-item"><strong>UCLA Extension</strong>, Full Stack Developer Bootcamp <span class="edu-date">(2021)</span></div>
    <div class="edu-item"><strong>Santa Monica College</strong>, A.S. Computer Science <span class="edu-date">(2022)</span></div>
  </div>


</body>
</html>`;

const generateResume = async (): Promise<void> => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const outputPath = path.join(__dirname, "..", "Jeffery_Patterson_Resume.pdf");

  await page.pdf({
    path: outputPath,
    format: "Letter",
    printBackground: true,
    margin: { top: "0", right: "0", bottom: "0", left: "0" },
  });

  await browser.close();
  console.log(`Resume generated: ${outputPath}`);
};

generateResume();
