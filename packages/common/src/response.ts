import { APIGatewayProxyStructuredResultV2 } from "aws-lambda";
import type { BucketItemStat } from "minio";

import { AppError } from "./error";

export const responseJson = (
  body: Record<string, unknown>,
  statusCode = 200
): APIGatewayProxyStructuredResultV2 => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=60"
  },
  body: JSON.stringify(body)
});

export const responseJsonError = (
  error: string,
  statusCode = 400
): APIGatewayProxyStructuredResultV2 => responseJson({ error }, statusCode);

export const responseError = (
  error: unknown
): APIGatewayProxyStructuredResultV2 => {
  if (error instanceof AppError) {
    return responseJsonError(error.message, error.statusCode);
  }
  const message = error instanceof Error ? error.message : "Unknown error(s)";
  return responseJsonError(message);
};

export const responseBase64 = (
  body: string,
  contentType: string,
  stat: BucketItemStat,
  statusCode = 200,
  maxAge = 31556926
): APIGatewayProxyStructuredResultV2 => {
  const { etag, lastModified } = stat;
  return {
    statusCode,
    headers: {
      "Content-Type": contentType,
      "Cache-Control": `public, max-age=${maxAge}`,
      ETag: `W/"${etag}"`,
      "Last-Modified": lastModified.toUTCString(),
      Expires: new Date(Date.now() + maxAge * 1000).toUTCString()
    },
    body,
    isBase64Encoded: true
  };
};
