import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useAppSelector } from "../../store/hooks";
import { useTypedDispatch } from "../../hooks/useRedux";
import {
  setNotificationFilters,
  fetchNotifications,
} from "../../store/slices/notification/fetchNotificationsSlice";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

const DEADLINE_COLORS = {
  "GRAVE EXPIRADO": "#FF0000",
  "NEAR MISS EXPIRADO": "#F6C48A",
  "NEVER EVENT EXPIRADO": "#8B4513",
  "ÓBITO EXPIRADO": "#000000",
};

const NotificationExpiredDeadlineChart: React.FC = () => {
  const dispatch = useTypedDispatch();
  const { groupedByDeadlineStatus, loading, error, activeFilters } =
    useAppSelector((state) => state.notifications);

  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (
      groupedByDeadlineStatus &&
      Object.keys(groupedByDeadlineStatus).length > 0
    ) {
      const data = Object.entries(groupedByDeadlineStatus).map(
        ([status, count]) => ({
          name: status,
          value: count,
          color:
            DEADLINE_COLORS[status as keyof typeof DEADLINE_COLORS] ||
            "#CCCCCC",
        })
      );

      const sortedData = data.sort((a, b) => b.value - a.value);
      setChartData(sortedData);
    } else {
      setChartData([]);
    }
  }, [groupedByDeadlineStatus]);

  const handlePieClick = (data: any) => {
    const clickedStatus = data.name;

    if (activeFilters.deadlineStatus === clickedStatus) {
      const newFilters = { ...activeFilters };
      delete newFilters.deadlineStatus;

      dispatch(setNotificationFilters(newFilters));
      dispatch(fetchNotifications(newFilters));
    } else {
      const newFilters = {
        ...activeFilters,
        deadlineStatus: clickedStatus,
        page: 1,
      };

      dispatch(setNotificationFilters(newFilters));
      dispatch(fetchNotifications(newFilters));
    }
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return <div>Carregando dados de prazos expirados...</div>;
  }

  if (error) {
    return <div>Erro ao carregar prazos expirados: {error}</div>;
  }

  return (
    <div>
      {chartData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                onClick={handlePieClick}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={
                      activeFilters.deadlineStatus === entry.name ? 1 : 0.7
                    }
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, name: any) => [
                  `${value} notificações`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          {activeFilters.deadlineStatus && (
            <div className="filter-indicator">
              <p>
                Filtrando por: {activeFilters.deadlineStatus}
                <button
                  className="clear-filter-btn"
                  onClick={() => {
                    const newFilters = { ...activeFilters };
                    delete newFilters.deadlineStatus;
                    dispatch(setNotificationFilters(newFilters));
                    dispatch(fetchNotifications(newFilters));
                  }}
                >
                  Limpar filtro
                </button>
              </p>
            </div>
          )}
        </>
      ) : (
        <div>Nenhum prazo expirado encontrado</div>
      )}
    </div>
  );
};

export default NotificationExpiredDeadlineChart;
