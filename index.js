const Log = require('bare-logger')
const fs = require('bare-fs')

module.exports = class FileLog extends Log {
  constructor(path, opts = {}) {
    super({ colors: false })

    this._path = path
    this._fd = fs.openSync(path, 'a+')
    this._maxSize = opts.maxSize || 0
  }

  append(label, ...data) {
    const line =
      label.padEnd(5, ' ') + ' ' + new Date().toISOString() + ' ' + this.format(...data) + '\n'
    fs.writeSync(this._fd, Buffer.from(line))

    if (this._maxSize > 0 && fs.fstatSync(this._fd).size > this._maxSize) {
      this._truncate()
    }
  }

  _truncate() {
    const buf = fs.readFileSync(this._path)
    const target = Math.floor(this._maxSize / 2)

    let i = buf.length - target
    while (i < buf.length && buf[i] !== 0x0a) i++
    if (i < buf.length) i++

    fs.closeSync(this._fd)
    fs.writeFileSync(this._path, buf.subarray(i))
    this._fd = fs.openSync(this._path, 'a+')
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
