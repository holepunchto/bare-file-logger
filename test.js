const test = require('brittle')
const fs = require('bare-fs')
const path = require('bare-path')
const FileLog = require('.')

test('basic', async (t) => {
  const log = new FileLog(path.join(await t.tmp(), 'test.log'))
  t.teardown(() => log.close())

  await t.execution(() => log.debug('This is a debug log'))
  await t.execution(() => log.info('This is an info log'))
  await t.execution(() => log.warn('This is a warning log'))
  await t.execution(() => log.error('This is an error log'))
})

test('maxSize truncates old entries', async (t) => {
  const file = path.join(await t.tmp(), 'test.log')
  const log = new FileLog(file, { maxSize: 1024 })
  t.teardown(() => log.close())

  for (let i = 0; i < 50; i++) {
    log.info('line ' + i)
  }

  const content = fs.readFileSync(file, 'utf8')
  const lines = content.trimEnd().split('\n')
  const first = lines[0]

  t.absent(first.includes('line 0'), 'first lines have been truncated')
  t.ok(first.startsWith('info '), 'file starts with a complete log line')
  t.ok(lines.length > 1, 'multiple lines are preserved')
})
