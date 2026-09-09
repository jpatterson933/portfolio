import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

// Version-matched shader compilers stay on our origin. No runtime CDN dependency.
const require = createRequire(import.meta.url);
const packageRoot = path.dirname(
  require.resolve("@babylonjs/core/package.json"),
);
const destination = new URL(
  "../public/character-stats/vendor/",
  import.meta.url,
);
await mkdir(destination, { recursive: true });
for (const directory of ["glslang", "twgsl"]) {
  await cp(
    path.join(packageRoot, "assets", directory),
    new URL(`${directory}/`, destination),
    { recursive: true },
  );
}
await cp(
  path.join(packageRoot, "license.md"),
  new URL("BABYLON-LICENSE.md", destination),
);
await cp(
  path.join(packageRoot, "NOTICE.md"),
  new URL("BABYLON-NOTICE.md", destination),
);
const { version } = JSON.parse(
  await readFile(path.join(packageRoot, "package.json"), "utf8"),
);
await writeFile(
  new URL("version.json", destination),
  JSON.stringify({ version }),
);
console.log(`Prepared local graphics assets for Babylon.js ${version}`);
