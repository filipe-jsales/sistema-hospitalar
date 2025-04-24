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
  incidentId?: number;
}

const classificationColors: Record<string, string> = {
  CIRCUNSTANCIAL: "#62B3E5",
  LEVE: "#A5A5A5",
  "SEM DANO": "#C5C5C5",
  "NEAR MISS": "#F6C48A",
  MODERADO: "#E7B95D",
  "NEVER EVENT": "#D39E52",
  GRAVE: "#C16D50",
  ÓBITO: "#9D3F3F",
  "(Em branco)": "#DEDEDE",
  CATASTRÓFICO: "#7A1818",
};

const defaultColors = [
  "#8884d8",
  "#83a6ed",
  "#8dd1e1",
  "#82ca9d",
  "#a4de6c",
  "#d0ed57",
  "#ffc658",
  "#ff8c42",
  "#ff6361",
  "#bc5090",
];

const NotificationIncidentClassificationChart: React.FC = () => {
  const dispatch = useTypedDispatch();
  const { loading, error, groupedByIncident, activeFilters, notifications } =
    useAppSelector((state) => state.notifications);

  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (groupedByIncident && notifications.length > 0) {
      const incidentNameToIdMap = new Map();

      notifications.forEach((notification) => {
        if (notification.incident) {
          incidentNameToIdMap.set(
            notification.incident.name,
            notification.incident.id
          );
        }
      });

      let chartData = Object.entries(groupedByIncident).map(
        ([name, count], index) => ({
          name,
          value: count,
          incidentId: incidentNameToIdMap.get(name),
          color:
            classificationColors[name] ||
            defaultColors[index % defaultColors.length],
        })
      );

      chartData = chartData.sort((a, b) => b.value - a.value);
      setData(chartData.slice(0, 10));
    }
  }, [groupedByIncident, notifications]);

  const handleBarClick = (entry: any, index: number) => {
    const clickedIncident = data[index];

    if (clickedIncident && clickedIncident.incidentId) {
      if (activeFilters.incidentId === clickedIncident.incidentId) {
        const newFilters = { ...activeFilters };
        delete newFilters.incidentId;

        dispatch(setNotificationFilters(newFilters));
        dispatch(fetchNotifications(newFilters));
      } else {
        const newFilters = {
          ...activeFilters,
          incidentId: clickedIncident.incidentId,
          page: 1,
        };

        dispatch(setNotificationFilters(newFilters));
        dispatch(fetchNotifications(newFilters));
      }
    }
  };

  if (loading) {
    return <div>Carregando dados de classificação de incidentes...</div>;
  }

  if (error) {
    return <div>Erro ao carregar classificações de incidentes: {error}</div>;
  }

  const maxValue =
    data.length > 0 ? Math.max(...data.map((item) => item.value)) : 0;
  const yAxisMax = Math.ceil(maxValue * 1.1);

  const tickCount = 5;
  const yAxisTicks = Array.from({ length: tickCount }, (_, i) =>
    Math.round((yAxisMax * i) / (tickCount - 1))
  );

  const activeIncidentName = data.find(
    (item) => item.incidentId === activeFilters.incidentId
  )?.name;

  return (
    <div className="chart-container">
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
                tick={{ fontSize: 10 }}
              />
              <YAxis ticks={yAxisTicks} />
              <Tooltip formatter={(value) => [`${value}`, "Quantidade"]} />
              <Bar
                dataKey="value"
                name="Quantidade"
                barSize={35}
                isAnimationActive={false}
                shape={(props: any) => {
                  const { x, y, width, height, index } = props;
                  const radius = [5, 5, 0, 0];
                  const entry = data[index];

                  const isActive =
                    activeFilters.incidentId === entry.incidentId;
                  const opacity = isActive ? 1 : 0.8;

                  const path = `
                    M ${x},${y + radius[0]} 
                    Q ${x},${y} ${x + radius[0]},${y}
                    L ${x + width - radius[1]},${y}
                    Q ${x + width},${y} ${x + width},${y + radius[1]}
                    L ${x + width},${y + height}
                    L ${x},${y + height}
                    Z
                  `;

                  return (
                    <path
                      d={path}
                      fill={entry.color}
                      fillOpacity={opacity}
                      onClick={() => handleBarClick(null, index)}
                      style={{ cursor: "pointer" }}
                    />
                  );
                }}
              />
            </BarChart>
          </ResponsiveContainer>

          {activeFilters.incidentId && (
            <div className="filter-indicator">
              <small>
                Filtrando por incidente: {activeIncidentName}
                <button
                  className="clear-filter-btn"
                  onClick={() => {
                    const newFilters = { ...activeFilters };
                    delete newFilters.incidentId;
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
        <div>Nenhum dado de classificação de incidentes encontrado</div>
      )}
    </div>
  );
};

export default NotificationIncidentClassificationChart;
