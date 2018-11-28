const util = require("util")
const exec = util.promisify(require("child_process").exec)

/**
 * @returns Raw JSON object which contains all docker-compose container states in current directory
 */
async function stateAll() {
  const dockerInfo = (await exec('docker-compose ps --q'))
    // fetch terminal output
    .stdout
    // split output in lines
    .split("\n")
    // filter out empty strings
    .filter(id => id !== "")
    // fetch informations to container id
    .map(async id => {
      const info = await exec(`docker inspect ${id}`)
      return info.stdout
    })
    // replace all newlines
    .map(async info => (await info).replace(/\n/g, ""))
    // parse into json
    .map(async info => JSON.parse(await info))
    // every container returns array of one, so we have to destructure it
    .map(async info => (await info)[0])

  return (await Promise.all(dockerInfo))
}

async function statusWithServiceName() {
  return (await stateAll())
    .map(container => {
      const rawImageName = container.Name
      // Image name has format <folder name>_<service name>_<id>
      //  so we have to split it
      const imageName = rawImageName.split("_")[1]

      const status = container.State.Status

      return { imageName, status }
    })
}

module.exports = { stateAll, statusWithServiceName }