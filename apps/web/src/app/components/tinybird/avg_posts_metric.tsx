"use client";

import { Metric } from "@/app/components/metric";
import { useState, useEffect } from "react";
import {
  AvgPostsResponse,
  PostsByDIDResponse,
  TinybirdResponse,
} from "@/lib/types";
import * as v from "valibot";

const token = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN;
const tinybird_base_url =
  process.env.NEXT_PUBLIC_TINYBIRD_BASE_URL ?? "https://api.tinybird.co/";

export function AvgPostsMetric() {
  const [avgPosts, setAvgPosts] = useState<AvgPostsResponse>({
    avg: 0,
  });

  async function fetchPostsTotal() {
    let url = new URL(`${tinybird_base_url}v0/pipes/avg_posts_api.json`);

    const result = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((r: TinybirdResponse) => {
        console.log(r);
        if (r.data.length > 0) {
          const data = v.parse(AvgPostsResponse, r.data[0]);
          setAvgPosts(data);
        } else {
          setAvgPosts({ avg: 0 });
        }
      })
      .catch((e) => e.toString());
  }

  useEffect(() => {
    fetchPostsTotal();
  }, []);

  return (
    <Metric
      title="Average posts"
      description="Average posts per account"
      content={avgPosts.avg.toString()}
    />
  );
}
