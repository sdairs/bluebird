"use client";

import { Metric } from "@/app/components/metric";
import { useState, useEffect } from "react";
import {
  PostsByDIDParams,
  PostsByDIDResponse,
  TinybirdResponse,
} from "@/lib/types";
import * as v from "valibot";

const token = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN;
const tinybird_base_url =
  process.env.NEXT_PUBLIC_TINYBIRD_BASE_URL ?? "https://api.tinybird.co/";

export function PostsByDIDMetric({ did }: PostsByDIDParams) {
  const [postsByDID, setPostsByDID] = useState<PostsByDIDResponse>({
    total: 0,
    did: "",
  });

  async function fetchPostsTotal() {
    const url = new URL(
      `${tinybird_base_url}v0/pipes/post_count_by_did_api.json`
    );

    url.searchParams.append("did", did);

    await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((r: TinybirdResponse) => {
        console.log(r);
        if (r.data.length > 0) {
          const data = v.parse(PostsByDIDResponse, r.data[0]);
          setPostsByDID(data);
        } else {
          setPostsByDID({ total: 0, did });
        }
      })
      .catch((e) => e.toString());
  }

  useEffect(() => {
    fetchPostsTotal();
  }, []);

  return (
    <Metric
      title="Posts by DID"
      description={`For ${did}`}
      content={postsByDID.total.toString()}
    />
  );
}
