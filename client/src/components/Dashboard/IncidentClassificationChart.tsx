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
import { useAppSelector } from "../../hooks/useRedux";

interface ChartData {
  name: string;
  value: number;
  color: string;
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

const IncidentClassificationChart: React.FC = () => {
  const { incidents, loading, error, groupedData } = useAppSelector(
    (state) => state.incidents
  );
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (groupedData) {
      let chartData = Object.entries(groupedData).map(
        ([name, count], index) => ({
          name,
          value: count,
          color:
            classificationColors[name] ||
            defaultColors[index % defaultColors.length],
        })
      );

      chartData = chartData.sort((a, b) => b.value - a.value);
      setData(chartData.slice(0, 10));
    } else if (incidents && incidents.length > 0) {
      console.warn("groupedData não disponível, usando fallback");
      const classificationCounts: Record<string, number> = {};

      incidents.forEach((incident) => {
        const name = incident.name || "(Em branco)";
        classificationCounts[name] = (classificationCounts[name] || 0) + 1;
      });

      let chartData = Object.entries(classificationCounts).map(
        ([name, count], index) => ({
          name,
          value: count,
          color:
            classificationColors[name] ||
            defaultColors[index % defaultColors.length],
        })
      );

      chartData = chartData.sort((a, b) => b.value - a.value);
      setData(chartData.slice(0, 10));
    }
  }, [groupedData, incidents]);

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

  return (
    <div className="chart-container">
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
              tick={{ fontSize: 10 }}
            />
            <YAxis ticks={yAxisTicks} />
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
      ) : (
        <div>Nenhum dado de classificação de incidentes encontrado</div>
      )}
    </div>
  );
};

export default IncidentClassificationChart;