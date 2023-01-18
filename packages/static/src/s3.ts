import { Client } from "minio";
import { AppError } from "@lambda-sharp/common";

import type { BucketItemStat } from "minio";
import type { AppConfig } from "./config.js";

export const loadStat = async (
  client: Client,
  bucket: string,
  key: string
): Promise<BucketItemStat> => {
  try {
    return await client.statObject(bucket, key);
  } catch (e) {
    if (e && typeof e === "object") {
      if ("message" in e && typeof e.message === "string" && e.message) {
        console.error(e.message);
      }
    }
    throw new AppError("Invalid bucket or key", 404);
  }
};

export const createClient = (config: AppConfig): Client => {
  const {
    awsRegion: region,
    awsEndPoint: endPoint,
    awsAccessKeyId: accessKey,
    awsSecretAccessKey: secretKey,
    awsSessionToken: sessionToken
  } = config;
  return new Client({
    region,
    endPoint,
    accessKey,
    secretKey,
    sessionToken
  });
};
