#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { auditLedger, readLedger, renderSummary, writeAudit } from './index.js';

const usage = 'Usage: connector-approval-ledger <validate|summarize> --ledger ledger.json [--out dir]';
const args = process.argv.slice(2);

if (args.includes('--help') || args.length === 0) {
  console.log(usage);
  process.exit(0);
}

if (args.includes('--version')) {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  console.log(pkg.version);
  process.exit(0);
}

const allowedOptions = new Set(['--ledger', '--out']);
const unknownOption = args.find(arg => arg.startsWith('--') && !allowedOptions.has(arg));
if (unknownOption) {
  console.error('Unknown option: ' + unknownOption);
  console.error(usage);
  process.exit(2);
}

function val(flag, fallback) {
  const index = args.indexOf(flag);
  return index === -1 ? fallback : args[index + 1];
}

const command = args[0];
const ledgerFile = val('--ledger');
const out = val('--out', 'ledger-out');

if (!ledgerFile) {
  console.error('Missing --ledger');
  process.exit(2);
}

const audit = auditLedger(readLedger(ledgerFile));
if (command === 'summarize') {
  process.stdout.write(renderSummary(audit));
} else if (command === 'validate') {
  writeAudit(audit, out);
  console.log('Wrote ' + out + '/approval-audit.json and ' + out + '/approval-summary.md');
  if (!audit.valid) process.exit(1);
} else {
  console.error('Unknown command: ' + command);
  process.exit(2);
}
