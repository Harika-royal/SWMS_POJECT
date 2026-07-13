import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

interface BarChartWidgetProps {
  data: any[];
  xKey: string;
  yKey: string | string[];
  colors?: string[];
  height?: number;
  stacked?: boolean;
}

export function BarChartWidget({ data, xKey, yKey, colors = ["hsl(var(--primary))"], height = 300, stacked = false }: BarChartWidgetProps) {
  const yKeys = Array.isArray(yKey) ? yKey : [yKey];

  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis 
            dataKey={xKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} 
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(val) => typeof val === 'number' && val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: '8px' }}
            cursor={{ fill: "hsl(var(--muted))" }}
          />
          {yKeys.map((key, index) => (
            <Bar 
              key={key} 
              dataKey={key} 
              fill={colors[index % colors.length]} 
              radius={stacked ? [0, 0, 0, 0] : [4, 4, 0, 0]} 
              stackId={stacked ? "a" : undefined}
              animationDuration={1000}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
