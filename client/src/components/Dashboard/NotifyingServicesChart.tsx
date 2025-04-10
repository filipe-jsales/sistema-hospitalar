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
import { fetchNotifyingServices } from "../../store/slices/notifyingService/fetchNotifyingServicesSlice";

interface NotifyingServicesChartProps {
  period: string;
}

interface ChartData {
  name: string;
  value: number;
}

const NotifyingServicesChart: React.FC<NotifyingServicesChartProps> = ({
  period,
}) => {
  const dispatch = useTypedDispatch();
  const { notifyingServices, loading, error, groupedData } = useAppSelector(
    (state) => state.notifyingServices
  );
  const [data, setData] = useState<ChartData[]>([]);

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
    dispatch(fetchNotifyingServices(1));
  }, [dispatch]);

  useEffect(() => {
    if (groupedData) {
      const chartData = Object.entries(groupedData).map(([name, count]) => ({
        name,
        value: applyPeriodFactor(count, period),
      }));

      const sortedData = chartData.sort((a, b) => b.value - a.value);

      // Limiting the chart to display the top 11 entries for better readability
      setData(sortedData.slice(0, 11));
    }
  }, [groupedData, period]);

  if (loading) {
    return <div>Carregando dados dos serviços de notificação...</div>;
  }

  if (error) {
    return <div>Erro ao carregar serviços de notificação: {error}</div>;
  }

  return (
    <div className="chart-container" style={{ height: 250 }}>
      {data.length > 0 ? (
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
              tick={{ fontSize: 9 }}
            />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}`, "Quantidade"]} />
            <Bar
              dataKey="value"
              name="Quantidade"
              fill="#00B8D4"
              radius={[5, 5, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div>Nenhum serviço de notificação encontrado</div>
      )}
    </div>
  );
};

export default NotifyingServicesChart;
