import { Writable } from "node:stream";

import type { WritableOptions } from "node:stream";

export interface Bufferable {
  toBuffer: () => Buffer;
}

export class BufferableStream extends Writable implements Bufferable {
  private readonly chunks: any[];

  public constructor(opts?: WritableOptions) {
    super(opts);
    this.chunks = [];
  }

  public toBuffer(): Buffer {
    return this.chunksToBuffer();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public _write(
    chunk: any,
    _: string,
    next: (error?: Error | null) => void
  ): void {
    this.chunks.push(chunk);
    next();
  }

  private chunksToBuffer(): Buffer {
    return Buffer.concat(this.chunks);
  }
}
