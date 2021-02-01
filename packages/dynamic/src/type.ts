export type JsonPrimitive = string | number | boolean | null;
export interface JsonMap extends Record<string, Json> {}
export interface JsonArray extends Array<Json> {}
export type Json = JsonPrimitive | JsonArray | JsonMap;

export interface Query {
  key: string;
  image: JsonArray[];
}
