import { execFileSync } from "node:child_process";

const output = execFileSync("npm", ["pack", "--dry-run", "--json"], {
  encoding: "utf8"
});
const [pack] = JSON.parse(output);
const files = new Set(pack.files.map((file) => file.path));

const required = [
  "src/cli.js",
  "src/index.js",
  "scripts/build.js",
  "scripts/check.js",
  "scripts/validate.sh",
  "fixtures/ledger.json",
  "fixtures/expected/approval-audit.json",
  "docs/API.md",
  "docs/RELEASE_CANDIDATE.md",
  "SKILL.md",
  "README.md",
  "LICENSE",
  "SECURITY.md"
];

const missing = required.filter((file) => !files.has(file));
if (missing.length) {
  console.error(`Package smoke failed; missing files:\n${missing.join("\n")}`);
  process.exit(1);
}

console.log(`package smoke ok: ${pack.filename} includes ${pack.files.length} files`);
