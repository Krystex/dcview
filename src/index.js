#!/usr/bin/env node

const chalk = require("chalk")
const { print, println, clear } = require("./terminal")
const docker = require("./docker")

const redrawTime = 2000 /* milliseconds */

async function main() {
  const containers = await docker.statusWithServiceName() 
  
  clear()
  print('\n')

  for (let container of containers) {
    print("  ")
    switch (container.status) {
      case "running"    : print(chalk.bold.green("✔")); break
      case "paused"     : print(chalk.bold.grey("Ⅱ")); break
      case "dead"       : print(chalk.bold.red("✘")); break
      case "restarting" : print(chalk.bold.cyan("•")); break
      case "exited"     : print(chalk.bold.grey("Ⅱ")); break
    }

    println(`  ${container.imageName}`)
  }

  print('\n')
}
main()
setInterval(main, redrawTime)