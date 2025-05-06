import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface DataPoint {
  name: string;
  value: number;
  percentage: number;
}

interface MedicationErrorChartProps {
  data: DataPoint[];
}

const MedicationErrorChart: React.FC<MedicationErrorChartProps> = ({
  data,
}) => {
  const COLORS: { [key: string]: string } = {
    ADMINISTRAÇÃO: "#FF0000",
    "CONDUTA ÉTICA": "#5C2D91",
  };

  interface TooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
  }

  const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        >
          <p style={{ margin: 0 }}>
            <strong>{data.name}</strong>
          </p>
          <p style={{ margin: 0 }}>Valor: {data.value}</p>
          <p style={{ margin: 0 }}>Percentual: {data.percentage}%</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = (props: any) => {
    const { payload } = props;
    if (!payload) return null;

    return (
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {payload.map(
          (
            entry: {
              value:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | null
                | undefined;
              color: any;
            },
            index: any
          ) => {
            const dataItem = data.find((item) => item.name === entry.value);

            return (
              <li
                key={`item-${index}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: "15px",
                    height: "15px",
                    backgroundColor: entry.color,
                    marginRight: "8px",
                  }}
                />
                <span style={{ fontWeight: "bold" }}>
                  {entry.value} {dataItem ? `${dataItem.percentage}%` : ""}
                </span>
              </li>
            );
          }
        )}
      </ul>
    );
  };

  return (
    <div style={{ width: "100%", height: 350, textAlign: "center" }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            labelLine={false}
            label={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  COLORS[entry.name] ||
                  Object.values(COLORS)[index % Object.values(COLORS).length]
                }
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} verticalAlign="bottom" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MedicationErrorChart;
