function print(message = "") {
  process.stdout.write(message)
}

function println(message) {
  process.stdout.write(message + "\n")
}

function clear() {
  print("\033[2J\033[0;0H")
}

module.exports = { print, println, clear }