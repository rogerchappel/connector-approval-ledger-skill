import { execFileSync } from "node:child_process";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const output = execFileSync("npm", ["pack", "--dry-run", "--json"], {
  encoding: "utf8"
});
const [pack] = JSON.parse(output);
const files = new Set(pack.files.map((file) => file.path));
const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

const required = [
  "src/cli.js",
  "src/index.js",
  "scripts/build.js",
  "scripts/check.js",
  "scripts/validate.sh",
  "scripts/validate-release-readiness.mjs",
  "fixtures/ledger.json",
  "fixtures/expected/approval-audit.json",
  "fixtures/expected/approval-summary.md",
  "docs/API.md",
  "docs/CLI.md",
  "docs/RELEASE_CANDIDATE.md",
  "SKILL.md",
  "README.md",
  "LICENSE",
  "SECURITY.md",
  "CONTRIBUTING.md",
  "CHANGELOG.md"
];

const missing = required.filter((file) => !files.has(file));
if (missing.length) {
  console.error(`Package smoke failed; missing files:\n${missing.join("\n")}`);
  process.exit(1);
}

if (packageJson.bin?.["connector-approval-ledger"] !== "src/cli.js") {
  console.error("Package smoke failed: connector-approval-ledger bin must point at src/cli.js");
  process.exit(1);
}

if (packageJson.engines?.node !== ">=20") {
  console.error("Package smoke failed: Node engine must document the node:test runtime baseline");
  process.exit(1);
}

const unknownOption = spawnSync(process.execPath, [
  packageJson.bin["connector-approval-ledger"],
  "summarize",
  "--ledger",
  "fixtures/ledger.json",
  "--format=json"
], {
  encoding: "utf8"
});
if (unknownOption.status !== 2 || !unknownOption.stderr.includes("Unknown option: --format=json")) {
  console.error("Package smoke failed: connector-approval-ledger must reject unknown options with exit code 2");
  process.exit(1);
}

console.log(`package smoke ok: ${pack.filename} includes ${pack.files.length} files`);
