# connector-approval-ledger-skill

Use this skill when an agent needs maintain local approval ledgers for connector dry-run plans before external action execution.

## Inputs

Local fixture or workflow files described in the README.

## Side effects

Writes local output files only. It does not execute connector actions or contact external services.

## Approval requirements

Any generated action, claim, or approval record must be reviewed before an external executor uses it.

## Validation

Run `npm run smoke`, inspect generated JSON and Markdown, and resolve any review issues.
