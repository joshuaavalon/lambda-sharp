import { strict as assert } from "node:assert";

export interface AwsEnvConfig {
  awsRegion?: string;
  awsAccessKeyId?: string;
  awsSecretAccessKey?: string;
  awsSessionToken?: string;
}

export interface AppEnvConfig extends AwsEnvConfig {
  awsEndPoint: string;
  awsBucket?: string;
  maxAge: string;
}

export interface AppConfig {
  awsEndPoint: string;
  awsRegion: string;
  awsBucket: string;
  awsAccessKeyId: string;
  awsSecretAccessKey: string;
  awsSessionToken?: string;
  maxAge: number;
}

export const readAwsEnv = (): AwsEnvConfig => {
  const {
    AWS_REGION: awsRegion,
    AWS_ACCESS_KEY_ID: awsAccessKeyId,
    AWS_SECRET_ACCESS_KEY: awsSecretAccessKey,
    AWS_SESSION_TOKEN: awsSessionToken
  } = process.env;
  return { awsRegion, awsAccessKeyId, awsSecretAccessKey, awsSessionToken };
};

export const readEnv = (): AppEnvConfig => {
  const {
    S3_ENDPOINT: awsEndPoint = "s3.amazonaws.com",
    S3_REGION: awsRegion,
    S3_BUCKET: awsBucket,
    S3_ACCESS_KEY_ID: awsAccessKeyId,
    S3_SECRET_ACCESS_KEY: awsSecretAccessKey,
    S3_SESSION_TOKEN: awsSessionToken,
    MAX_AGE: maxAge = "31556926"
  } = process.env;
  return {
    awsRegion,
    awsBucket,
    awsEndPoint,
    awsAccessKeyId,
    awsSecretAccessKey,
    awsSessionToken,
    maxAge
  };
};

const defaultAwsEnv = (
  defaultAws: boolean,
  env: AwsEnvConfig,
  awsEnv: AwsEnvConfig
): AwsEnvConfig => {
  const awsRegion =
    !env.awsRegion && defaultAws ? awsEnv.awsRegion : env.awsRegion;
  const awsAccessKeyId =
    !env.awsAccessKeyId && defaultAws
      ? awsEnv.awsAccessKeyId
      : env.awsAccessKeyId;
  const awsSecretAccessKey =
    !env.awsSecretAccessKey && defaultAws
      ? awsEnv.awsSecretAccessKey
      : env.awsSecretAccessKey;
  const awsSessionToken =
    !env.awsSessionToken && defaultAws
      ? awsEnv.awsSessionToken
      : env.awsSessionToken;
  return { awsRegion, awsAccessKeyId, awsSecretAccessKey, awsSessionToken };
};

export const readEnvConfig = (defaultAws = true): AppConfig => {
  const { awsBucket, awsEndPoint, maxAge: maxAgeStr, ...env } = readEnv();
  const awsEnv = readAwsEnv();
  const { awsRegion, awsAccessKeyId, awsSecretAccessKey, awsSessionToken } =
    defaultAwsEnv(defaultAws, env, awsEnv);

  assert.ok(maxAgeStr);
  assert.ok(awsBucket);
  assert.ok(awsRegion);
  assert.ok(awsAccessKeyId);
  assert.ok(awsSecretAccessKey);
  const maxAge = parseInt(maxAgeStr);
  if (!Number.isInteger(maxAge) || maxAge < 0) {
    throw new Error("MAX_AGE should be positive integer");
  }
  return {
    awsBucket,
    awsEndPoint,
    awsRegion,
    awsAccessKeyId,
    awsSecretAccessKey,
    awsSessionToken,
    maxAge
  };
};
