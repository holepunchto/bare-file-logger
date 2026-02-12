# bare-file-logger

File system logger for Bare.

## Usage

```js
const FileLog = require('bare-file-logger')

const log = new FileLog('console.log')

log.info('Hello %s', 'world!')
```

Optionally pass a `maxSize` to automatically truncate old entries when the file exceeds the given size in bytes:

```js
const log = new FileLog('console.log', { maxSize: 200 * 1024 * 1024 }) // 200 MB
```

## License

Apache-2.0
