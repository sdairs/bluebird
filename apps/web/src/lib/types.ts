import * as v from "valibot";

export const TinybirdResponse = v.object({
  data: v.array(v.any()),
  meta: v.array(v.any()),
  rows: v.number(),
  rows_before_limit_at_least: v.number(),
  statistics: v.object({
    elapsed: v.number(),
    rows_read: v.number(),
    bytes_read: v.number(),
  }),
});
export type TinybirdResponse = v.InferOutput<typeof TinybirdResponse>;

export const PostsByDIDResponse = v.object({
  total: v.number(),
  did: v.string(),
});
export type PostsByDIDResponse = v.InferOutput<typeof PostsByDIDResponse>;

export const PostsByDIDParams = v.object({
  did: v.string(),
});
export type PostsByDIDParams = v.InferInput<typeof PostsByDIDParams>;

export const DailyAccountCreationsVsDeletionsResponse = v.object({
  day: v.string(),
  created: v.number(),
  deleted_or_deactivated: v.number(),
});
export type DailyAccountCreationsVsDeletionsResponse = v.InferOutput<
  typeof DailyAccountCreationsVsDeletionsResponse
>;

export const DailyAccountCreationsVsDeletionsParams = v.object({
  since: v.string(),
});
export type DailyAccountCreationsVsDeletionsParams = v.InferInput<
  typeof DailyAccountCreationsVsDeletionsParams
>;

export const AvgPostsResponse = v.object({
  avg: v.number(),
});
export type AvgPostsResponse = v.InferOutput<typeof AvgPostsResponse>;
