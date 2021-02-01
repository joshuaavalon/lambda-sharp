import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { responseBase64, responseError } from "@lambda-sharp/common";

import { getQuery, validateJwt } from "./utils";
import { AppConfig, readEnvConfig } from "./config";
import { createClient, loadStat } from "./s3";
import { transformImage } from "./transform";

export const createHandler = (
  appConfig?: AppConfig
): APIGatewayProxyHandlerV2 => async event => {
  try {
    const q = getQuery(event);
    const config = appConfig ? appConfig : readEnvConfig();
    const { awsBucket } = config;
    const query = validateJwt(config, q);
    const { key = "", image = [] } = query;
    const client = createClient(config);
    const stat = await loadStat(client, awsBucket, key);
    const rs = await client.getObject(awsBucket, key);
    const { body, contentType } = await transformImage(rs, image);
    return responseBase64(body, contentType, stat);
  } catch (e) {
    return responseError(e);
  }
};
