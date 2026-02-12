import Log from 'bare-logger'

interface FileLogOptions {
  maxSize?: number
}

interface FileLog extends Log, Disposable {
  append(label: string, ...data: unknown[]): void
  close(): void
}

declare class FileLog {
  constructor(path: string, options?: FileLogOptions)
}

declare namespace FileLog {
  export { FileLogOptions }
}

export = FileLog
