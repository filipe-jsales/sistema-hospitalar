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
  notifyingServiceId?: number;
}

const NotificationNotifyingServiceChart: React.FC = () => {
  const dispatch = useTypedDispatch();
  const {
    loading,
    error,
    groupedByNotifyingService,
    activeFilters,
    notifications,
  } = useAppSelector((state) => state.notifications);

  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (groupedByNotifyingService && notifications.length > 0) {
      const serviceNameToIdMap = new Map();

      notifications.forEach((notification) => {
        if (notification.notifyingService) {
          serviceNameToIdMap.set(
            notification.notifyingService.name,
            notification.notifyingService.id
          );
        }
      });

      const chartData = Object.entries(groupedByNotifyingService).map(
        ([name, count]) => ({
          name,
          value: count,
          notifyingServiceId: serviceNameToIdMap.get(name),
        })
      );

      const sortedData = chartData.sort((a, b) => b.value - a.value);
      setData(sortedData.slice(0, 11));
    }
  }, [groupedByNotifyingService, notifications]);

  const handleBarClick = (entry: any, index: number) => {
    console.log("Bar clicked:", entry, index);

    if (entry.notifyingServiceId) {
      if (activeFilters.notifyingServiceId === entry.notifyingServiceId) {
        const newFilters = { ...activeFilters };
        delete newFilters.notifyingServiceId;

        dispatch(setNotificationFilters(newFilters));
        dispatch(fetchNotifications(newFilters));
      } else {
        const newFilters = {
          ...activeFilters,
          notifyingServiceId: entry.notifyingServiceId,
          page: 1,
        };

        dispatch(setNotificationFilters(newFilters));
        dispatch(fetchNotifications(newFilters));
      }
    }
  };

  if (loading) {
    return <div>Carregando dados dos serviços de notificação...</div>;
  }

  if (error) {
    return <div>Erro ao carregar serviços de notificação: {error}</div>;
  }

  const activeServiceName = data.find(
    (item) => item.notifyingServiceId === activeFilters.notifyingServiceId
  )?.name;

  return (
    <div className="chart-container" style={{ height: 250 }}>
      {data.length > 0 ? (
        <>
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
                cursor="pointer"
                onClick={handleBarClick}
                fillOpacity={0.7}
                className="notification-bar"
                style={{
                  opacity: 0.7,
                }}
                shape={(props: any) => {
                  const { x, y, width, height, fill } = props;
                  const opacity =
                    props.payload.notifyingServiceId ===
                    activeFilters.notifyingServiceId
                      ? 1
                      : 0.7;
                  return (
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={fill}
                      fillOpacity={opacity}
                      rx={5}
                      ry={5}
                    />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>

          {activeFilters.notifyingServiceId && (
            <div className="filter-indicator">
              <small>
                Filtrando por serviço: {activeServiceName}
                <button
                  className="clear-filter-btn"
                  onClick={() => {
                    const newFilters = { ...activeFilters };
                    delete newFilters.notifyingServiceId;
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
        <div>Nenhum serviço de notificação encontrado</div>
      )}
    </div>
  );
};

export default NotificationNotifyingServiceChart;
