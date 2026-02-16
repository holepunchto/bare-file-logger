import EventEmitter, { EventMap } from 'bare-events'
import Log from 'bare-logger'

interface FileLogOptions {
  maxSize?: number
  rotate?: (path: string) => string
  rotateInterval?: number
}

interface FileLogEvents extends EventMap {
  rotate: [path: string, archived: string | null]
}

interface FileLog extends EventEmitter<FileLogEvents>, Log, Disposable {
  append(label: string, ...data: unknown[]): void
  close(): void
}

declare class FileLog {
  constructor(path: string, options?: FileLogOptions)
}

declare namespace FileLog {
  export { FileLogOptions, FileLogEvents }
}

export = FileLog
