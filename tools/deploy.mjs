import http from 'http'
import { readFile, readFileSync, writeFileSync } from 'fs'
import { createInterface } from 'readline'
import { exec } from 'child_process'

exec('pwd', (e, stdout, stderr) => {
	console.log({ e, stdout, stderr })
})
