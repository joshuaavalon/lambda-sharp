import { responseBase64, responseError } from "@lambda-sharp/common";
import { getQuery } from "./utils.js";
import { readEnvConfig } from "./config.js";
import { createClient, loadStat } from "./s3.js";
import { transformImage } from "./transform.js";

import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import type { DefinedTransform } from "./type.js";
import type { AppConfig } from "./config.js";

export const createHandler =
  (
    defined: DefinedTransform,
    appConfig?: AppConfig
  ): APIGatewayProxyHandlerV2 =>
  async event => {
    try {
      const { extension, key, transform } = getQuery(event);
      const image = defined[transform];
      if (!image) {
        throw new Error(`Unknown transform: ${transform}`);
      }
      const config = appConfig ? appConfig : readEnvConfig();
      const { awsBucket } = config;
      const client = createClient(config);
      const stat = await loadStat(client, awsBucket, key);
      const rs = await client.getObject(awsBucket, key);
      const { body, contentType } = await transformImage(rs, image, extension);
      return responseBase64(body, contentType, stat);
    } catch (e) {
      return responseError(e);
    }
  };
