# @lambda-sharp/static

[![License][license_badge]][license] [![Pipelines][pipelines_badge]][pipelines] [![NPM][npm_badge]][npm]

Real-time image processing on pre-defined transformation.

## Getting Started

```
npm i @lambda-sharp/static
```

You can use `createHandler` to create a lambda handler.

```typescript
import { createHandler, ImageQuery } from "@lambda-sharp/static";

const thumbnail: ImageQuery = {
  queries: [{ method: "resize", params: [{ width: 400, height: 400 }] }],
  output: {
    webp: [],
    png: [],
    jpeg: [],
  },
};

export const handler = createHandler({ thumbnail });
```

Then, you need to configure an API Gateway where the route is `/<BASE_PATH>/{transform}/{path+}` and the method is `GET`.

Now you can access the image from `https://<DOMAIN>/<BASE_PATH>/<TRANSFORM>/<KEY>.<EXTENSION>`.

## Usage

**createHandler(defined: DefinedTransform, appConfig?: AppConfig)**

- `defined`: Defined named transformation.

```typescript
const defined: DefinedTransform = {
  thumbnail: {
    queries: [{ method: "resize", params: [{ width: 400, height: 400 }] }],
    output: {
      webp: [],
      png: [],
      jpeg: [],
    },
  },
};
```

This create a transformation that named `thumbnail`. It resizes images to 400x400 and it allows to output webp, png and jpeg.

You can add more method call in `queries`. Also, You can pass custom parameters to `output`.

- `appConfig`: Configuration for access S3. By default, it reads from AWS pre-defined variables.

If you use lambda execution role to access, you only need to defined `awsBucket` or environment variable `S3_BUCKET`.

[license]: https://github.com/joshuaavalon/lambda-sharp/blob/master/packages/static/LICENSE
[license_badge]: https://img.shields.io/npm/l/@lambda-sharp/static
[pipelines]: https://github.com/joshuaavalon/lambda-sharp/actions
[pipelines_badge]: https://github.com/joshuaavalon/lambda-sharp/workflows/Master/badge.svg
[npm]: https://www.npmjs.com/package/@lambda-sharp/static
[npm_badge]: https://img.shields.io/npm/v/@lambda-sharp/static/latest.svg
