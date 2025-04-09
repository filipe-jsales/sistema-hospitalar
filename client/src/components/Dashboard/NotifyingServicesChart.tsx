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

interface NotifyingServicesChartProps {
  period: string;
}

interface ServiceData {
  name: string;
  value: number;
}

const NotifyingServicesChart: React.FC<NotifyingServicesChartProps> = ({
  period,
}) => {
  const [data, setData] = useState<ServiceData[]>([]);

  useEffect(() => {
    const mockData: ServiceData[] = [
      { name: "CENTRO CIRÚRGICO", value: 870 },
      { name: "UTI GERAL", value: 695 },
      { name: "UTI CORONARIANA", value: 532 },
      { name: "PSIQUIATRIA", value: 402 },
      { name: "UTI NEUROLÓGICA", value: 306 },
      { name: "ENFERMARIA NEURO", value: 212 },
      { name: "ENFERMARIA CLÍNICA", value: 199 },
      { name: "ENFERMARIA CIRÚRGICA", value: 195 },
      { name: "CENTRO DE DIAGNÓSTICO", value: 187 },
      { name: "ENFERMARIA ORTOPEDIA", value: 179 },
      { name: "PSIQUIATRÍA INFANTIL", value: 143 },
    ];

    if (period !== "Todos") {
      const factor =
        period === "Último mês"
          ? 0.08
          : period === "Últimos 3 meses"
          ? 0.25
          : period === "Últimos 6 meses"
          ? 0.5
          : 1;

      const filteredData = mockData.map((item) => ({
        ...item,
        value: Math.round(item.value * factor),
      }));

      setData(filteredData);
    } else {
      setData(mockData);
    }
  }, [period]);

  return (
    <div className="chart-container" style={{ height: 250 }}>
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
    </div>
  );
};

export default NotifyingServicesChart;
