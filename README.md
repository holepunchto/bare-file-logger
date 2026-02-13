# bare-file-logger

File system logger for Bare.

## Usage

```js
const FileLog = require('bare-file-logger')

const log = new FileLog('console.log')

log.info('Hello %s', 'world!')
```

## API

#### `const log = new FileLog(path[, options])`

Options include:

```js
options = {
  // Maximum allowed byte size of the log file. This is a hint and not a hard
  // limit; the logger will do its best to keep the file size within the limit,
  // but provides no guarantees.
  maxSize: 0,

  // A function called when the file size reaches `maxSize`. It receives the
  // current file path and should return a new path to rename the file to, or a
  // falsy value to do nothing. After a successful rename, a new empty log file
  // is opened at the original path.
  rotate: null,

  // The interval in milliseconds at which the file size is checked against
  // `maxSize` for rotation. Only active when both `maxSize` and `rotate` are
  // set. The check starts after the first write.
  rotateInterval: 2000
}
```

#### Rotation

```js
const log = new FileLog('app.log', {
  maxSize: 1024 * 1024, // 1 MB
  rotate(filePath) {
    return filePath + '.' + Date.now()
  }
})
```

When the log file reaches `maxSize`, the `rotate` function is called. If it returns a path, the current file is renamed to that path and a fresh log file is opened. If it returns a falsy value, no action is taken.

#### `log.on('rotate', (path, dest) => {})`

Emitted after a successful rotation. `path` is the original log file path (now empty and ready for new writes) and `dest` is the path the previous log was renamed to.

## License

Apache-2.0
