#!/usr/bin/env node
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { homedir } from 'node:os';
import { join } from 'node:path';

const helpOnly = ['help', '--help'].includes(process.argv[2]);
if (!process.env.ZENTAO_URL && !helpOnly) {
  console.error('请先设置 ZENTAO_URL，指向你有权访问的禅道根地址。');
  process.exit(1);
}
const site = new URL(process.env.ZENTAO_URL || 'https://zentao.example.com');
if (!['http:', 'https:'].includes(site.protocol) || site.username || site.password) throw new Error('无效的禅道地址');
site.search = ''; site.hash = '';
site.pathname = site.pathname.replace(/\/my\/?$/, '/').replace(/\/$/, '');
const normalized = site.toString().replace(/\/$/, '');
process.env.ZENTAO_URL = normalized;
if (!process.env.ZENTAO_SESSION_FILE) {
  const key = createHash('sha256').update(normalized).digest('hex').slice(0, 16);
  process.env.ZENTAO_SESSION_FILE = join(homedir(), '.config', 'zentao-legacy', key, 'session.json');
}
createRequire(import.meta.url)('./zentao-runtime.cjs');
