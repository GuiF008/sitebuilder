#!/usr/bin/env node
/**
 * S'assure que les dossiers public nécessaires existent.
 * Les pictos SVG et hosting-hero.png sont versionnés.
 */
const fs = require('fs')
const path = require('path')

const pictosDir = path.join(process.cwd(), 'public', 'pictos')
fs.mkdirSync(pictosDir, { recursive: true })
