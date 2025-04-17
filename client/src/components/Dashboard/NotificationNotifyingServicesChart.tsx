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
}

const NotificationNotifyingServiceChart: React.FC = () => {
  const { loading, error, groupedByNotifyingService } = useAppSelector(
    (state) => state.notifications
  );
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (groupedByNotifyingService) {
      const chartData = Object.entries(groupedByNotifyingService).map(([name, count]) => ({
        name,
        value: count,
      }));

      // Ordena por valor decrescente e limita aos 10 maiores
      const sortedData = chartData.sort((a, b) => b.value - a.value);
      setData(sortedData.slice(0, 11));
    }
  }, [groupedByNotifyingService]);

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

export default NotificationNotifyingServiceChart;