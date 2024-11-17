"use client";

import { useEffect, useState } from "react";
import {
  TinybirdResponse,
  DailyAccountCreationsVsDeletionsResponse,
  DailyAccountCreationsVsDeletionsParams,
} from "@/lib/types";
import * as v from "valibot";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  created: {
    label: "Created",
    color: "hsl(var(--chart-2))",
  },
  deleted_or_deactivated: {
    label: "Deleted/deactivated",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

const token = process.env.NEXT_PUBLIC_TINYBIRD_TOKEN;
const tinybird_base_url =
  process.env.NEXT_PUBLIC_TINYBIRD_BASE_URL ?? "https://api.tinybird.co/";

export function DailyAccountCreationsVsDeletionsLineChart({
  since,
}: DailyAccountCreationsVsDeletionsParams) {
  const [chartData, setChartData] = useState<
    DailyAccountCreationsVsDeletionsResponse[]
  >([]);

  async function fetchData() {
    let url = new URL(
      `${tinybird_base_url}v0/pipes/daily_account_creations_vs_deletions_api.json`
    );

    url.searchParams.set("since", since);

    const result = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((r) => r.json())
      .then((r: TinybirdResponse) => {
        const data = v.parse(
          v.array(DailyAccountCreationsVsDeletionsResponse),
          r.data
        );
        setChartData(data);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Creations vs Deletions</CardTitle>
        <CardDescription>Since {since}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="created"
              type="monotone"
              stroke="var(--color-created)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="deleted_or_deactivated"
              type="monotone"
              stroke="var(--color-deleted_or_deactivated)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
