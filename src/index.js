const util = require('util')
const exec = util.promisify(require('child_process').exec)

async function main() {
  debugger;
  const dockerInfo = (await exec('docker-compose ps --q'))
    // fetch terminal output
    .stdout
    // split output in lines
    .split("\n")
    // filter out empty strings
    .filter(id => id !== "")
    // fetch informations to container id
    .map(async id => await exec(`docker inspect ${id}`))
    // get output to each container
    .map(async info => (await info).stdout)
    // replace all newlines
    .map(async info => (await info).replace(/\n/g, ""))
    // parse into json
    .map(async info => JSON.parse(await info))

  const infos = await Promise.all(dockerInfo)
  
  console.log(infos)
}
main();