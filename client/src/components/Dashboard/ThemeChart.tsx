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
  const { themes, loading, error } = useAppSelector((state) => state.themes);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const processThemeData = (themesList: any[], periodFilter: string) => {
    if (!themesList || themesList.length === 0) return [];

    const processedData = themesList.map((theme) => ({
      name: theme.name,
      value: calculateValueForPeriod(100, periodFilter),
      color: "#00E5CF",
    }));

    return processedData.sort((a, b) => b.value - a.value);
  };

  const calculateValueForPeriod = (baseValue: number, periodFilter: string) => {
    const random = Math.floor(Math.random() * 20) + 1;
    const base = baseValue * random;

    switch (periodFilter) {
      case "Último mês":
        return Math.round(base * 0.08);
      case "Últimos 3 meses":
        return Math.round(base * 0.25);
      case "Últimos 6 meses":
        return Math.round(base * 0.5);
      default:
        return base;
    }
  };

  useEffect(() => {
    dispatch(fetchThemes(1));
  }, [dispatch]);

  useEffect(() => {
    if (themes.length > 0) {
      const data = processThemeData(themes, period);
      setChartData(data);
    }
  }, [themes, period]);

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
