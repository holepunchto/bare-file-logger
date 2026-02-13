const Log = require('bare-logger')
const EventEmitter = require('bare-events')
const fs = require('bare-fs')

const FileLog = (module.exports = class FileLog extends EventEmitter {
  constructor(path, opts = {}) {
    const { maxSize = 0, rotate = null, rotateInterval = 2000 } = opts

    super()

    this.colors = false
    this._path = path
    this._maxSize = maxSize
    this._rotate = rotate
    this._rotateInterval = rotateInterval
    this._interval = null
    this._fd = fs.openSync(this._path, 'a+')

    if (this._maxSize > 0 && fs.fstatSync(this._fd).size > this._maxSize) {
      this.clear()
    }
  }

  _checkRotate() {
    if (this._fd === -1) return
    if (this._maxSize <= 0 || this._rotate === null) return

    const size = fs.fstatSync(this._fd).size

    if (size >= this._maxSize) {
      const dest = this._rotate(this._path)

      if (dest) {
        fs.closeSync(this._fd)
        fs.renameSync(this._path, dest)
        this._fd = fs.openSync(this._path, 'a+')
        this.emit('rotate', this._path, dest)
      }
    }
  }

  _startRotateCheck() {
    if (this._interval !== null) return
    if (this._maxSize <= 0 || this._rotate === null) return

    this._interval = setInterval(() => this._checkRotate(), this._rotateInterval)
    if (this._interval.unref) this._interval.unref()
  }

  append(label, ...data) {
    fs.writeSync(
      this._fd,
      label.padEnd(5, ' ') + ' ' + new Date().toISOString() + ' ' + this.format(...data) + '\n'
    )

    this._startRotateCheck()
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
    if (this._interval !== null) {
      clearInterval(this._interval)
      this._interval = null
    }
    fs.closeSync(this._fd)
    this._fd = -1
  }

  [Symbol.dispose]() {
    this.close()
  }
})

FileLog.prototype.format = Log.prototype.format
