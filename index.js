const Log = require('bare-logger')
const fs = require('bare-fs')

module.exports = class FileLog extends Log {
  constructor(path, opts = {}) {
    const { maxSize = 0 } = opts

    super({ colors: false })

    this._path = path
    this._maxSize = maxSize

    this._fd = fs.openSync(this._path, 'a+')

    if (this._maxSize > 0 && fs.fstatSync(this._fd).size > this._maxSize) {
      this.clear()
    }
  }

  append(label, ...data) {
    fs.writeSync(
      this._fd,
      label.padEnd(5, ' ') + ' ' + new Date().toISOString() + ' ' + this.format(...data) + '\n'
    )
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
    fs.ftruncateSync(this._fd)
    fs.closeSync(this._fd)

    this._fd = fs.openSync(this._path, 'a+')
  }

  close() {
    if (this._fd === -1) return
    fs.closeSync(this._fd)
    this._fd = -1
  }

  [Symbol.dispose]() {
    this.close()
  }
}
