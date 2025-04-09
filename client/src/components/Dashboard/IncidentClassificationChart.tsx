import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface IncidentClassificationProps {
  period: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const IncidentClassificationChart: React.FC<IncidentClassificationProps> = ({
  period,
}) => {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const mockData: ChartData[] = [
      { name: "CIRCUNSTANCIAL", value: 5010, color: "#62B3E5" },
      { name: "LEVE", value: 874, color: "#A5A5A5" },
      { name: "SEM DANO", value: 721, color: "#C5C5C5" },
      { name: "NEAR MISS", value: 493, color: "#F6C48A" },
      { name: "MODERADO", value: 284, color: "#E7B95D" },
      { name: "NEVER EVENT", value: 82, color: "#D39E52" },
      { name: "GRAVE", value: 35, color: "#C16D50" },
      { name: "ÓBITO", value: 35, color: "#9D3F3F" },
      { name: "(Em branco)", value: 13, color: "#DEDEDE" },
      { name: "CATASTRÓFICO", value: 4, color: "#7A1818" },
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

      setData(filteredData);
    } else {
      setData(mockData);
    }
  }, [period]);

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={70}
            tick={{ fontSize: 10 }}
          />
          <YAxis
            label={{
              value: "Mil",
              angle: -90,
              position: "insideLeft",
              style: { textAnchor: "middle" },
            }}
            ticks={[0, 2000, 4000]}
            tickFormatter={(value) => `${value / 1000} Mil`}
          />
          <Tooltip formatter={(value) => [`${value}`, "Quantidade"]} />
          <Bar
            dataKey="value"
            name="Quantidade"
            radius={[5, 5, 0, 0]}
            barSize={35}
            fill="#8884d8"
            fillOpacity={0.8}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncidentClassificationChart;
