const Log = require('bare-logger')
const fs = require('bare-fs')

module.exports = class FileLog extends Log {
  constructor(path) {
    super({ colors: false })

    this._fd = fs.openSync(path, 'a+')
  }

  append(label, ...data) {
    fs.writeSync(
      this._fd,
      label.padEnd(5, ' ') +
        ' ' +
        new Date().toISOString() +
        ' ' +
        this.format(...data) +
        '\n'
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
