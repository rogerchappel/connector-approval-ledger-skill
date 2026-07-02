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

## Safety

Local files only. No network calls, publishing, or external account writes. Generated outputs are review artifacts and require human approval before downstream action.
