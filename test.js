const test = require('brittle')
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
