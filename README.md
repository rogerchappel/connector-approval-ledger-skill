# connector-approval-ledger-skill

Maintain local approval ledgers for connector dry-run plans before external action execution.

## Quickstart

```bash
npm install
npm run release:check
```

Run the fixture-backed approval audit directly:

```bash
node src/cli.js summarize --ledger fixtures/ledger.json
node src/cli.js --version
node src/cli.js validate --ledger fixtures/ledger.json --out ledger-out
```

The smoke check runs those commands against a temporary output directory and
asserts that both `approval-audit.json` and `approval-summary.md` are written.

## Verify

CI runs each release gate separately so failures point at the broken layer:

- `npm run check`
- `npm run lint`
- `npm run build`
- `npm test`
- `npm run smoke`
- `npm run package:smoke`

Run `npm run release:check` locally before opening a release PR.

`npm run release:readiness` verifies the package metadata, CLI bin target,
supporting docs, fixture presence, npm files allowlist, and CI workflow before
the runtime smoke and package dry-run checks execute.

`npm run package:smoke` fails if the npm tarball would omit the CLI, library
API, fixtures, release-candidate docs, skill instructions, license, security
policy, contribution guide, or changelog.

## Safety

Local files only. No network calls, publishing, or external account writes. Generated outputs are review artifacts and require human approval before downstream action.
