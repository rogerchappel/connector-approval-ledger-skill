import test from 'node:test';
import assert from 'node:assert/strict';
import {auditLedger,validateEntry} from '../src/index.js';
test('valid approved entry passes',()=>{const i=validateEntry({id:'a1',status:'approved',connector:'email',summary:'send recap',approvedBy:'roger',expiresAt:'2099-01-01T00:00:00Z'},new Date('2026-01-01T00:00:00Z'));assert.deepEqual(i,[]);});
test('expired approval fails',()=>{const a=auditLedger({entries:[{id:'a1',status:'approved',connector:'crm',summary:'update deal',approvedBy:'roger',expiresAt:'2020-01-01T00:00:00Z'}]},new Date('2026-01-01T00:00:00Z'));assert.equal(a.valid,false);assert.match(a.results[0].issues.join(' '),/expired/);});
