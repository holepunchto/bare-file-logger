const Log = require('bare-logger')
const EventEmitter = require('bare-events')
const fs = require('bare-fs')

class FileLog extends EventEmitter {
  constructor(path, opts = {}) {
    const { maxSize = 0, rotate = null, rotateInterval = 2000 } = opts

    super()

    this._path = path
    this._maxSize = maxSize
    this._rotate = rotate

    this._interval = setInterval(this._gc.bind(this), rotateInterval)
    this._interval.unref()

    this._fd = fs.openSync(this._path, 'a+')
    this._gc()
  }

  get colors() {
    return false
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

    if (this._interval) clearInterval(this._interval)

    fs.closeSync(this._fd)

    this._fd = -1
    this._interval = null
  }

  [Symbol.dispose]() {
    this.close()
  }

  _gc() {
    if (this._fd === -1 || this._maxSize <= 0 || fs.fstatSync(this._fd).size < this._maxSize) return

    let archived
    try {
      archived = this._rotate && this._rotate(this._path)
    } catch {
      archived = null
    }

    if (this._fd === -1) return

    if (archived) fs.renameSync(this._path, archived)
    else fs.ftruncateSync(this._fd)

    fs.closeSync(this._fd)

    this._fd = fs.openSync(this._path, 'a+')

    this.emit('rotate', this._path, archived)
  }
}

FileLog.prototype.format = Log.prototype.format

module.exports = FileLog
