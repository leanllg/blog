#!/usr/bin/env node
const fs = require('fs')
const path = require('path')

const argv = require('yargs')
  .demandCommand(1, 1)
  .alias('d', 'desc')
  .option('force', {
    alias: 'f',
    boolean: true,
    describe: 'will overwrite exist post'
  })
  .argv

let filePath = argv._[0]
const description = argv.desc
const titlePattern = /# (.*)\n/

if (!path.isAbsolute(filePath)) {
  filePath = path.resolve('./', filePath)
}

let file = fs.readFileSync(filePath)
const fileName = path.basename(filePath, '.md')
const postPath = path.resolve(__dirname, '../content/blog')
const postDir = path.resolve(postPath, fileName.replace(/\s/g, '-'))

if (fs.existsSync(postDir)) {
  console.log('the post is exists')
  process.exit()
} else {
  fs.mkdirSync(postDir)
}

let title = titlePattern.exec(file)

function now() {
  let date = new Date()

  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

let postMarkdown = `
---
title: ${title[1]}
date: ${now()}
${description && `description: ${description}`}
---
`.trimLeft()

file = file.toString().replace(titlePattern, postMarkdown)

fs.writeFile(path.resolve(postDir, 'index.md'), file, (err) => {
  if (err) {
    console.log(err)
  } else {
    console.log('post success!')
  }
})
