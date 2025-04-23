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
import { useTypedDispatch } from "../../hooks/useRedux";
import {
  setNotificationFilters,
  fetchNotifications,
} from "../../store/slices/notification/fetchNotificationsSlice";

interface ChartData {
  name: string;
  value: number;
  color: string;
  themeId?: number;
}

const NotificationThemeChart: React.FC = () => {
  const dispatch = useTypedDispatch();
  const { loading, error, groupedByTheme, activeFilters, notifications } =
    useAppSelector((state) => state.notifications);

  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (groupedByTheme && notifications.length > 0) {
      const themeNameToIdMap = new Map();

      notifications.forEach((notification) => {
        if (notification.theme) {
          themeNameToIdMap.set(notification.theme.name, notification.theme.id);
        }
      });

      const data = Object.entries(groupedByTheme).map(([name, count]) => ({
        name,
        value: count,
        color: "#00E5CF",
        themeId: themeNameToIdMap.get(name),
      }));

      const sortedData = data.sort((a, b) => b.value - a.value);
      setChartData(sortedData);
    }
  }, [groupedByTheme, notifications]);

  const handleBarClick = (data: any, index: number) => {
    const clickedTheme = chartData[index];

    if (clickedTheme.themeId) {
      if (activeFilters.themeId === clickedTheme.themeId) {
        const newFilters = { ...activeFilters };
        delete newFilters.themeId;

        dispatch(setNotificationFilters(newFilters));
        dispatch(fetchNotifications(newFilters));
      } else {
        const newFilters = {
          ...activeFilters,
          themeId: clickedTheme.themeId,
          page: 1,
        };

        dispatch(setNotificationFilters(newFilters));
        dispatch(fetchNotifications(newFilters));
      }
    }
  };

  if (loading) {
    return <div>Carregando dados dos temas...</div>;
  }

  if (error) {
    return <div>Erro ao carregar temas: {error}</div>;
  }

  return (
    <div>
      {chartData.length > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) =>
                  value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value
                }
              />
              <Tooltip
                formatter={(value, name) => [`${value}`, "Quantidade"]}
              />
              <Bar
                dataKey="value"
                fill="#00E5CF"
                onClick={handleBarClick}
                cursor="pointer"
                fillOpacity={0.7}
                isAnimationActive={false}
                shape={(props: any) => {
                  const { x, y, width, height, payload } = props;
                  const opacity = activeFilters.themeId === payload.themeId ? 1 : 0.7;
                  return (
                    <rect 
                      x={x} 
                      y={y} 
                      width={width} 
                      height={height} 
                      fill="#00E5CF" 
                      fillOpacity={opacity}
                      onClick={() => handleBarClick(null, props.index)}
                      style={{ cursor: 'pointer' }}
                    />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>

          {activeFilters.themeId && (
            <div className="filter-indicator">
              <small>
                Filtrando por tema:{" "}
                {
                  chartData.find(
                    (item) => item.themeId === activeFilters.themeId
                  )?.name
                }
                <button
                  className="clear-filter-btn"
                  onClick={() => {
                    const newFilters = { ...activeFilters };
                    delete newFilters.themeId;
                    dispatch(setNotificationFilters(newFilters));
                    dispatch(fetchNotifications(newFilters));
                  }}
                >
                  Limpar filtro
                </button>
              </small>
            </div>
          )}
        </>
      ) : (
        <div>Nenhum tema encontrado</div>
      )}
    </div>
  );
};

export default NotificationThemeChart;
