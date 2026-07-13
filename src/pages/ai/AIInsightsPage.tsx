import { PageHeader } from '@/components/layout';
import { PageTransition, StaggerList, StaggerItem } from '@/components/animations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertTriangle, Route, Box, DollarSign, RefreshCw, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from "react";

export default function AIInsightsPage() {

const [insights] = useState([
  {
    id: '1',
    title: 'Demand Forecast',
    description: 'Expected 35% surge in Q3 electronics orders based on historical data and market trends.',
    confidence: 92,
    metric: '+35% Volume',
    impact: 'High',
    icon: TrendingUp,
    color: 'text-blue-500'
  },
  {
    id: '2',
    title: 'Reorder Recommendation',
    description: '12 SKUs in Packaging will stock out before next scheduled delivery. Immediate PO recommended.',
    confidence: 98,
    metric: '12 SKUs Risk',
    impact: 'Critical',
    icon: AlertTriangle,
    color: 'text-red-500'
  },
  {
    id: '3',
    title: 'Route Optimization',
    description: 'Picking paths in Zone B are suboptimal. Re-routing could save 45 minutes per shift.',
    confidence: 85,
    metric: '-45m / Shift',
    impact: 'Medium',
    icon: Route,
    color: 'text-emerald-500'
  },
  {
    id: '4',
    title: 'Space Utilization',
    description: 'Consolidating half-empty pallets in Rack 42-45 can free up 150 sq ft of premium space.',
    confidence: 90,
    metric: '+150 sq ft',
    impact: 'Medium',
    icon: Box,
    color: 'text-amber-500'
  },
  {
    id: '5',
    title: 'Supplier Risk',
    description: 'Supplier "Global Mfg" has been late on 4 of the last 5 deliveries. Consider secondary source.',
    confidence: 78,
    metric: '80% Late Rate',
    impact: 'High',
    icon: Zap,
    color: 'text-orange-500'
  },
  {
    id: '6',
    title: 'Cost Reduction',
    description: 'Switching to ground freight for non-urgent shipments to West Coast can save $12k/month.',
    confidence: 88,
    metric: '-$12k / mo',
    impact: 'High',
    icon: DollarSign,
    color: 'text-emerald-600'
  }
]);

useEffect(() => {
  // Future AI integration
}, []);
  useEffect(() => {
  // Future AI API integration
}, []);
  return (
    <PageTransition>
      <PageHeader title="AI Insights" subtitle="Predictive analytics and optimization recommendations">
        <Button
  variant="outline"
  onClick={() => window.location.reload()}
>
  <RefreshCw className="h-4 w-4 mr-2" />
  Refresh Model
</Button>
      </PageHeader>
      
      <div className="p-6 lg:p-8">
        <div className="mb-6 flex items-center p-4 bg-primary/10 text-primary rounded-lg border border-primary/20">
          <Brain className="h-5 w-5 mr-3" />
          <div>
            <h3 className="font-semibold">SWMS Intelligence Engine</h3>
            <p className="text-sm opacity-90">Analyzing 1.2M data points across inventory, orders, and operations.</p>
          </div>
        </div>

        <StaggerList className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {insights.map((insight) => {
            const Icon = insight.icon;
            return (
              <StaggerItem key={insight.id}>
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${insight.color}`} />
                        <CardTitle className="text-base">{insight.title}</CardTitle>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        insight.impact === 'Critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30' :
                        insight.impact === 'High' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30'
                      }`}>
                        {insight.impact}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-4">
                    <CardDescription className="text-sm flex-1">
                      {insight.description}
                    </CardDescription>
                    
                    <div className="bg-muted/50 p-3 rounded-md space-y-3">
                      <div className="flex justify-between items-center text-sm font-medium">
                        <span>Expected Impact</span>
                        <span className={insight.color}>{insight.metric}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Confidence Score</span>
                          <span>{insight.confidence}%</span>
                        </div>
                        <Progress value={insight.confidence} className="h-1.5" />
                      </div>
                    </div>
                    
                    <Button
  variant="secondary"
  className="w-full"
  onClick={() =>
    alert(`${insight.title} applied successfully.`)
  }
>
  Apply Recommendation
</Button>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerList>
      </div>
    </PageTransition>
  );
}
