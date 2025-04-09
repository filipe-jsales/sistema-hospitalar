import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ExpiredTermsChartProps {
  period: string;
}

interface PieData {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

const ExpiredTermsChart: React.FC<ExpiredTermsChartProps> = ({ period }) => {
  const [data, setData] = useState<PieData[]>([]);

  useEffect(() => {
    const mockData: PieData[] = [
      {
        name: "NEAR MISS EXPIRADO",
        value: 125,
        color: "#F6C48A",
        percentage: 63.45,
      },
      {
        name: "NEVER EVENT EXPIRADO",
        value: 58,
        color: "#8B4513",
        percentage: 29.44,
      },
      { name: "GRAVE EXPIRADO", value: 10, color: "#FF0000", percentage: 5.08 },
      { name: "ÓBITO EXPIRADO", value: 4, color: "#000000", percentage: 2.03 },
    ];

    if (period !== "Todos") {
      const factor =
        period === "Último mês"
          ? 0.08
          : period === "Últimos 3 meses"
          ? 0.25
          : period === "Últimos 6 meses"
          ? 0.5
          : 1;

      const filteredData = mockData.map((item) => ({
        ...item,
        value: Math.round(item.value * factor),
      }));

      const total = filteredData.reduce((sum, item) => sum + item.value, 0);
      const updatedData = filteredData.map((item) => ({
        ...item,
        percentage: parseFloat(((item.value / total) * 100).toFixed(2)),
      }));

      setData(updatedData);
    } else {
      setData(mockData);
    }
  }, [period]);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    outerRadius,
    percent,
    index,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={data[index].color}
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={10}
      >
        {`${data[index].name} ${(percent * 100).toFixed(2)}%`}
      </text>
    );
  };

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            innerRadius={40}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name, props) => [
              `${value} (${props.payload.percentage}%)`,
              name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpiredTermsChart;
