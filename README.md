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
  maxSize: 0
}
```

## License

Apache-2.0
