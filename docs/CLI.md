# CLI Behavior

`connector-approval-ledger` accepts two commands:

```bash
connector-approval-ledger summarize --ledger fixtures/ledger.json
connector-approval-ledger validate --ledger fixtures/ledger.json --out ledger-out
```

## Exit Codes

- `0` - the ledger was read and the requested command completed.
- `1` - `validate` wrote the audit artifacts, but the ledger failed approval
  validation.
- `2` - the command line was incomplete, used an unknown command, or included an
  unknown option.

Unknown options are rejected instead of ignored so release scripts, CI jobs, and
agent dry runs fail loudly when a flag is misspelled.
