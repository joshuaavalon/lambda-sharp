import { Readable } from "stream";
import { BufferableStream } from "./buffer-stream";

export async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const bufferableStream = new BufferableStream();
  return new Promise<Buffer>((resolve, reject) => {
    stream
      .on("error", error => {
        bufferableStream.emit("error", error);
      })
      .pipe(bufferableStream)
      .on("finish", () => {
        resolve(bufferableStream.toBuffer());
      })
      .on("error", reject);
  });
}
