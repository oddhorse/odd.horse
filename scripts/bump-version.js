#!/usr/bin/env node
import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packagePath = join(__dirname, '../package.json');

async function bumpVersion() {
  const pkg = JSON.parse(await readFile(packagePath, 'utf-8'));
  const [major, minor] = pkg.version.split('.').map(Number);
  
  // Bump minor version (for major bumps, edit this manually before committing)
  const newVersion = `${major}.${minor + 1}`;
  
  pkg.version = newVersion;
  await writeFile(packagePath, JSON.stringify(pkg, null, '\t') + '\n');
  
  console.log(`Version bumped to ${newVersion}`);
}

bumpVersion().catch(console.error);
