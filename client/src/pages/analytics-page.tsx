import { AnalyticsDashboard } from "@/components/analytics-dashboard"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-analytics-title">
          Analytics & Reports
        </h1>
        <p className="text-muted-foreground">
          Monitor your sweet shop performance with detailed analytics and insights
        </p>
      </div>

      <AnalyticsDashboard />
    </div>
  )
}