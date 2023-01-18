import jwt from "jsonwebtoken";
import { AppError } from "@lambda-sharp/common";

import type { APIGatewayProxyEventV2 } from "aws-lambda";
import type { AppConfig } from "./config.js";
import type { Query } from "./type.js";

export const getQuery = (event: APIGatewayProxyEventV2): string => {
  const { q } = event.queryStringParameters || {};
  if (!q) {
    throw new AppError("Missing query parameter(s)");
  }
  return q;
};

export const validateJwt = (config: AppConfig, token: string): Query => {
  const { jwtSecret } = config;
  try {
    return jwt.verify(token, jwtSecret) as any;
  } catch (e) {
    throw new AppError("Invalid JWT", 403);
  }
};
