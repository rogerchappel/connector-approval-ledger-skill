#!/usr/bin/env node
import {auditLedger,readLedger,renderSummary,writeAudit} from './index.js';
const args=process.argv.slice(2);if(args.includes('--help')||args.length===0){console.log('Usage: connector-approval-ledger <validate|summarize> --ledger ledger.json [--out dir]');process.exit(0);}
function val(f,d){const i=args.indexOf(f);return i===-1?d:args[i+1];}
const command=args[0], ledgerFile=val('--ledger'), out=val('--out','ledger-out');if(!ledgerFile){console.error('Missing --ledger');process.exit(2);}
const audit=auditLedger(readLedger(ledgerFile));if(command==='summarize') process.stdout.write(renderSummary(audit));else if(command==='validate'){writeAudit(audit,out);console.log('Wrote '+out+'/approval-audit.json and '+out+'/approval-summary.md');if(!audit.valid) process.exit(1);}else{console.error('Unknown command: '+command);process.exit(2);}
