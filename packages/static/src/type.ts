import type { Sharp } from "sharp";
import type { Duplex } from "stream";

type FormatMethod =
  | "png"
  | "jpeg"
  | "webp"
  | "avif"
  | "heif"
  | "tiff"
  | "toFile"
  | "toBuffer"
  | "toFormat";

export type SharpTransformMethod = Exclude<
  keyof Sharp,
  keyof Duplex | FormatMethod
>;
export type SharpMethod = Exclude<keyof Sharp, keyof Duplex>;
export type SharpParameters<T extends SharpMethod> = Parameters<Sharp[T]>;
type ToFormatParameters<T extends any[]> = T extends [unknown, ...infer R]
  ? [...R]
  : never;

export interface SharpQuery<
  T extends SharpTransformMethod = SharpTransformMethod
> {
  method: T;
  params: SharpParameters<T>;
}

export interface ImageQuery {
  queries: SharpQuery[];
  output: {
    [ext: string]: ToFormatParameters<SharpParameters<"toFormat">>;
  };
}

export interface DefinedTransform {
  [key: string]: ImageQuery | true;
}
