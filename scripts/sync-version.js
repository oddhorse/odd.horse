#!/usr/bin/env node
// sync-version.js
// on beta branch pre-commit, pull version from main branch's package.json
// keeps beta from drifting out of sync after main bumps its version

import { execSync } from 'child_process'
import { readFile, writeFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packagePath = join(__dirname, '../package.json')

async function syncVersion() {
	// read version straight from main branch in git — no checkout needed
	const mainPkgRaw = execSync('git show main:package.json').toString()
	const mainVersion = JSON.parse(mainPkgRaw).version

	const pkg = JSON.parse(await readFile(packagePath, 'utf-8'))

	if (pkg.version === mainVersion) {
		console.log(`version already in sync (${mainVersion})`)
		return
	}

	const oldVersion = pkg.version
	pkg.version = mainVersion
	await writeFile(packagePath, JSON.stringify(pkg, null, '\t') + '\n')
	console.log(`version synced to main: ${oldVersion} -> ${mainVersion}`)
}

syncVersion().catch(console.error)
