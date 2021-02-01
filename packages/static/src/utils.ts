import { APIGatewayProxyEventV2 } from "aws-lambda";
import { AppError } from "@lambda-sharp/common";

export interface Query {
  key: string;
  transform: string;
  extension: string;
}

const queryRegex = /^(?<key>.+)(?<extension>\..+)$/u;
export const getQuery = (event: APIGatewayProxyEventV2): Query => {
  const { path, transform } = event.pathParameters || {};
  if (!path || !transform) {
    throw new AppError("Missing path parameter(s)", 404);
  }
  const result = queryRegex.exec(path);
  if (!result?.groups) {
    throw new AppError("Invalid path", 400);
  }
  const { key, extension } = result.groups;
  return {
    key,
    extension,
    transform
  };
};
