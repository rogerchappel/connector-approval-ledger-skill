import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);
const cli = fileURLToPath(new URL('../src/cli.js', import.meta.url));
const ledger = fileURLToPath(new URL('../fixtures/ledger.json', import.meta.url));

async function runCli(args) {
  try {
    const result = await execFileAsync(process.execPath, [cli, ...args]);
    return { code: 0, ...result };
  } catch (error) {
    return {
      code: error.code,
      stdout: error.stdout,
      stderr: error.stderr
    };
  }
}

test('summarizes the fixture ledger through the CLI', async () => {
  const result = await runCli(['summarize', '--ledger', ledger]);

  assert.equal(result.code, 0);
  assert.match(result.stdout, /Connector Approval Ledger Summary/);
  assert.match(result.stdout, /Valid: true/);
  assert.equal(result.stderr, '');
});

test('writes audit artifacts through the CLI', async () => {
  const out = await mkdtemp(join(tmpdir(), 'connector-approval-ledger-'));

  try {
    const result = await runCli(['validate', '--ledger', ledger, '--out', out]);
    assert.equal(result.code, 0);
    assert.match(result.stdout, /approval-audit\.json/);

    const audit = JSON.parse(await readFile(join(out, 'approval-audit.json'), 'utf8'));
    const summary = await readFile(join(out, 'approval-summary.md'), 'utf8');
    assert.equal(audit.valid, true);
    assert.match(summary, /Connector Approval Ledger Summary/);
  } finally {
    await rm(out, { force: true, recursive: true });
  }
});

test('reports missing ledger arguments as usage errors', async () => {
  const result = await runCli(['validate']);

  assert.equal(result.code, 2);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /Missing --ledger/);
});

test('rejects unknown CLI options', async () => {
  const result = await runCli(['summarize', '--ledger', ledger, '--format=json']);

  assert.equal(result.code, 2);
  assert.equal(result.stdout, '');
  assert.match(result.stderr, /Unknown option: --format=json/);
  assert.match(result.stderr, /Usage: connector-approval-ledger/);
});

test('prints command usage for help', async () => {
  const result = await runCli(['--help']);

  assert.equal(result.code, 0);
  assert.match(result.stdout, /connector-approval-ledger <validate\|summarize>/);
  assert.equal(result.stderr, '');
});

test('prints package version metadata', async () => {
  const result = await runCli(['--version']);

  assert.equal(result.code, 0);
  assert.equal(result.stdout, '0.1.0\n');
  assert.equal(result.stderr, '');
});
