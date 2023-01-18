import sharp from "sharp";
import { fileTypeFromBuffer } from "file-type";
import mime from "mime-types";
import { streamToBuffer } from "@lambda-sharp/stream";
import { AppError } from "@lambda-sharp/common";

import type { Readable } from "node:stream";
import type { Sharp } from "sharp";
import type { Json, JsonArray } from "./type.js";

const defaultContentType = "application/octet-stream";

function assertQuery(query: JsonArray): asserts query is [string, ...Json[]] {
  if (!Array.isArray(query) || query.length < 1) {
    throw new Error("query is not an array or is empty");
  }
  if (typeof query[0] !== "string") {
    throw new Error("first parameter must be string");
  }
}

const transform = (queries: JsonArray[]): Sharp =>
  queries.reduce((shp, query) => {
    assertQuery(query);
    const [method, ...params] = query;
    if (typeof shp[method] !== "function") {
      throw new AppError(`${method} is not a function`);
    }
    return shp[method](...params);
  }, sharp());

const getFormat = (queries: JsonArray[]): string | undefined => {
  const query = queries[queries.length - 1];
  assertQuery(query);
  const [method, format] = query;
  if (method !== "toFormat") {
    throw new AppError("last query must be toFormat");
  }
  return typeof format === "string" ? format : undefined;
};

const guestContentType = (query: JsonArray[]): string => {
  const format = getFormat(query);
  let contentType: string | undefined = undefined;
  if (format) {
    contentType = mime.types[format];
  }
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
  queries: JsonArray[]
): Promise<TransformResult> => {
  if (!Array.isArray(queries) || queries.length < 1) {
    throw new Error("query is not an array or is empty");
  }
  const contentType = guestContentType(queries);
  const buffer = await rs.pipe(transform(queries)).toBuffer();
  return {
    contentType,
    body: buffer.toString("base64")
  };
};

export const transformImage = async (
  rs: Readable,
  queries: JsonArray[]
): Promise<TransformResult> => {
  const format = getFormat(queries);
  return format === "origin"
    ? transformOrigin(rs)
    : transformSharp(rs, queries);
};
