import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAppSelector } from "../../hooks/useRedux";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const NotificationThemeChart: React.FC = () => {
  const { loading, error, groupedByTheme } = useAppSelector(
    (state) => state.notifications
  );
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (groupedByTheme) {
      const data = Object.entries(groupedByTheme).map(([name, count]) => ({
        name,
        value: count,
        color: "#00E5CF",
      }));

      const sortedData = data.sort((a, b) => b.value - a.value);
      setChartData(sortedData);
    }
  }, [groupedByTheme]);

  if (loading) {
    return <div>Carregando dados dos temas...</div>;
  }

  if (error) {
    return <div>Erro ao carregar temas: {error}</div>;
  }

  return (
    <div className="chart-container">
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              domain={[0, "dataMax"]}
              tickFormatter={(value) =>
                value >= 1000 ? `${value / 1000}k` : value
              }
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 10 }}
              width={120}
            />
            <Tooltip formatter={(value) => [`${value}`, "Quantidade"]} />
            <Bar
              dataKey="value"
              name="Quantidade"
              barSize={16}
              radius={[0, 4, 4, 0]}
              fill="#00E5CF"
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div>Nenhum tema encontrado</div>
      )}
    </div>
  );
};

export default NotificationThemeChart;