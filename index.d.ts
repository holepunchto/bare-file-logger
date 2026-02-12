import Log from 'bare-logger'

interface FileLog extends Log, Disposable {
  append(label: string, ...data: unknown[]): void
  close(): void
}

declare class FileLog {
  constructor(path: string, opts?: { maxSize?: number })
}

export = FileLog
