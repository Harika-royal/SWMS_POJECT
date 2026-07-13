import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';

interface PieChartWidgetProps {
  data: any[];
  nameKey: string;
  dataKey: string;
  colors?: string[];
  height?: number;
  donut?: boolean;
}

export function PieChartWidget({ 
  data, 
  nameKey, 
  dataKey, 
  colors = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"], 
  height = 300,
  donut = true
}: PieChartWidgetProps) {
  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            nameKey={nameKey}
            dataKey={dataKey}
            cx="50%"
            cy="50%"
            innerRadius={donut ? "60%" : 0}
            outerRadius="80%"
            paddingAngle={donut ? 2 : 0}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: '8px' }}
            itemStyle={{ color: "hsl(var(--foreground))" }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
