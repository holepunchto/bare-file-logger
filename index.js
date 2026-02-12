const Log = require('bare-logger')
const fs = require('bare-fs')

module.exports = class FileLog extends Log {
  #path
  #maxSize
  #rotate
  #rotateInterval
  #interval = null
  #fd

  constructor(path, opts = {}) {
    const { maxSize = 0, rotate = null, rotateInterval = 2000 } = opts

    super({ colors: false })

    this.#path = path
    this.#maxSize = maxSize
    this.#rotate = rotate
    this.#rotateInterval = rotateInterval
    this.#fd = fs.openSync(this.#path, 'a+')

    if (this.#maxSize > 0 && fs.fstatSync(this.#fd).size > this.#maxSize) {
      this.clear()
    }
  }

  #checkRotate() {
    if (this.#fd === -1) return
    if (this.#maxSize <= 0 || this.#rotate === null) return

    const size = fs.fstatSync(this.#fd).size

    if (size >= this.#maxSize * 0.8) {
      const dest = this.#rotate(this.#path)

      if (dest) {
        fs.closeSync(this.#fd)
        fs.renameSync(this.#path, dest)
        this.#fd = fs.openSync(this.#path, 'a+')
      }
    }
  }

  #startRotateCheck() {
    if (this.#interval !== null) return
    if (this.#maxSize <= 0 || this.#rotate === null) return

    this.#interval = setInterval(() => this.#checkRotate(), this.#rotateInterval)
  }

  append(label, ...data) {
    fs.writeSync(
      this.#fd,
      label.padEnd(5, ' ') + ' ' + new Date().toISOString() + ' ' + this.format(...data) + '\n'
    )

    this.#startRotateCheck()
  }

  debug(...data) {
    this.append('debug', ...data)
  }

  info(...data) {
    this.append('info', ...data)
  }

  warn(...data) {
    this.append('warn', ...data)
  }

  error(...data) {
    this.append('error', ...data)
  }

  fatal(...data) {
    this.append('fatal', ...data)
  }

  clear() {
    fs.ftruncateSync(this.#fd)
    fs.closeSync(this.#fd)
    this.#fd = fs.openSync(this.#path, 'a+')
  }

  close() {
    if (this.#fd === -1) return
    if (this.#interval !== null) {
      clearInterval(this.#interval)
      this.#interval = null
    }
    fs.closeSync(this.#fd)
    this.#fd = -1
  }

  [Symbol.dispose]() {
    this.close()
  }
}
