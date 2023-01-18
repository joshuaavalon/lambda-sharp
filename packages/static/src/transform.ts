import sharp from "sharp";
import { fileTypeFromBuffer } from "file-type";
import mime from "mime-types";
import { streamToBuffer } from "@lambda-sharp/stream";
import { AppError } from "@lambda-sharp/common";

import type { Readable } from "node:stream";
import type { FormatEnum, Sharp } from "sharp";
import type { ImageQuery } from "./type.js";

const defaultContentType = "application/octet-stream";

const transform = (image: ImageQuery, extension: string): Sharp => {
  const { queries, output } = image;
  const format = extension.substring(1) as keyof FormatEnum;
  const formatParams = output[format];
  return queries
    .reduce((shp, query) => {
      const { method, params } = query;
      if (typeof shp[method] !== "function") {
        throw new AppError(`${method} is not a function`);
      }
      return (shp[method] as any)(...params);
    }, sharp())
    .toFormat(format, ...formatParams);
};

const guestContentType = (extension: string): string => {
  const contentType = mime.lookup(extension);
  return contentType ? contentType : defaultContentType;
};

export interface TransformResult {
  contentType: string;
  body: string;
}

const transformOrigin = async (rs: Readable): Promise<TransformResult> => {
  const buffer = await streamToBuffer(rs);
  const result = await fileTypeFromBuffer(Buffer.from(buffer));
  const contentType = result?.mime ?? defaultContentType;
  return {
    contentType: contentType,
    body: buffer.toString("base64")
  };
};

const transformSharp = async (
  rs: Readable,
  image: ImageQuery,
  extension: string
): Promise<TransformResult> => {
  const contentType = guestContentType(extension);
  const buffer = await rs.pipe(transform(image, extension)).toBuffer();
  return {
    contentType,
    body: buffer.toString("base64")
  };
};

export const transformImage = async (
  rs: Readable,
  image: ImageQuery | true,
  extension: string
): Promise<TransformResult> => {
  if (image === true) {
    return transformOrigin(rs);
  }
  return transformSharp(rs, image, extension);
};
