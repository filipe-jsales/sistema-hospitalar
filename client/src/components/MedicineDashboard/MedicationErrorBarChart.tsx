import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
}

interface MedicationErrorBarChartProps {
  data: DataPoint[];
  color?: string;
}

const MedicationErrorBarChart: React.FC<MedicationErrorBarChartProps> = ({
  data,
  color = "#005450", // cor padrão verde escura similar à imagem
}) => {
  // Formatar dados para o gráfico
  const chartData = data.map((item) => ({
    name: item.name,
    valor: item.value,
  }));

  return (
    <div
      className="medication-error-bar-chart-container"
      style={{ width: "100%", height: 300 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 70,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="valor" fill={color} name="Quantidade">
            <LabelList
              dataKey="valor"
              position="top"
              style={{ fontSize: "12px", fontWeight: "bold" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MedicationErrorBarChart;
