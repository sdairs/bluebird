import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Metric } from "./components/metric";
import { AvgPostsMetric } from "./components/tinybird/avg_posts_metric";
import { DailyAccountCreationsVsDeletionsLineChart } from "./components/tinybird/daily_account_creations_vs_deletions_line";
import { PostsByDIDMetric } from "./components/tinybird/posts_by_did_metric";

export default function Home() {
  return (
    <div>
      <div className="w-3/4 h-full mx-auto">
        <h1 className="text-2xl font-bold my-8">Bluebird 🦋🐦</h1>
        <div className="grid grid-cols-1 gap-2">
          <div className="grid grid-cols-4 gap-2">
            <PostsByDIDMetric did="did:plc:v5eua6zogv3j7lb7jo477jvx" />
            <AvgPostsMetric />
            <Metric
              title="placeholder"
              description="placeholder"
              content="placeholder"
            />
            <Metric
              title="placeholder"
              description="placeholder"
              content="placeholder"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <DailyAccountCreationsVsDeletionsLineChart since="2024-01-01" />
            <Card>
              <CardHeader>
                <CardTitle>placeholder</CardTitle>
                <CardDescription>placeholder</CardDescription>
              </CardHeader>
              <CardContent>placeholder</CardContent>
            </Card>
            <Card className="min-h-[400px] mb-4">
              <CardHeader>
                <CardTitle>placeholder</CardTitle>
                <CardDescription>placeholder</CardDescription>
              </CardHeader>
              <CardContent>placeholder</CardContent>
            </Card>
            <Card className="min-h-[400px] mb-4">
              <CardHeader>
                <CardTitle>placeholder</CardTitle>
                <CardDescription>placeholder</CardDescription>
              </CardHeader>
              <CardContent>placeholder</CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
