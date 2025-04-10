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
import { useAppSelector, useTypedDispatch } from "../../hooks/useRedux";
import { fetchThemes } from "../../store/slices/theme/fetchThemesSlice";

interface ThemeChartProps {
  period: string;
}

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const ThemeChart: React.FC<ThemeChartProps> = ({ period }) => {
  const dispatch = useTypedDispatch();
  const { themes, loading, error, groupedData } = useAppSelector(
    (state) => state.themes
  );
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const applyPeriodFactor = (value: number, periodFilter: string): number => {
    const factor =
      periodFilter === "Último mês"
        ? 0.08
        : periodFilter === "Últimos 3 meses"
        ? 0.25
        : periodFilter === "Últimos 6 meses"
        ? 0.5
        : 1;

    return Math.round(value * factor);
  };

  useEffect(() => {
    dispatch(fetchThemes(1));
  }, [dispatch]);

  useEffect(() => {
    if (groupedData) {
      const data = Object.entries(groupedData).map(([name, count]) => ({
        name,
        value: applyPeriodFactor(count, period),
        color: "#00E5CF",
      }));

      const sortedData = data.sort((a, b) => b.value - a.value);

      setChartData(sortedData);
    } else if (themes.length > 0) {
      console.warn("groupedData não disponível, usando fallback");

      const themeCounts: Record<string, number> = {};
      themes.forEach((theme) => {
        themeCounts[theme.name] = (themeCounts[theme.name] || 0) + 1;
      });

      const data = Object.entries(themeCounts).map(([name, count]) => ({
        name,
        value: applyPeriodFactor(count, period),
        color: "#00E5CF",
      }));

      const sortedData = data.sort((a, b) => b.value - a.value);
      setChartData(sortedData);
    }
  }, [groupedData, themes, period]);

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

export default ThemeChart;
