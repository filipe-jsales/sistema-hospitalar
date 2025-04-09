import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface ThemeChartProps {
  period: string;
}

interface ThemeData {
  name: string;
  value: number;
  color: string;
}

const ThemeChart: React.FC<ThemeChartProps> = ({ period }) => {
  const [data, setData] = useState<ThemeData[]>([]);

  useEffect(() => {
    const mockData: ThemeData[] = [
      { name: 'OUTROS', value: 3033, color: '#00E5CF' },
      { name: 'ARTIGO_MÉDICO', value: 984, color: '#00E5CF' },
      { name: 'MEDICAMENTO', value: 779, color: '#00E5CF' },
      { name: 'CIRURGIA', value: 524, color: '#00E5CF' },
      { name: 'LESÕES_DE_PELE', value: 515, color: '#00E5CF' },
      { name: 'FLEBITE', value: 436, color: '#00E5CF' },
      { name: 'QUEDA', value: 263, color: '#00E5CF' },
      { name: 'DESABASTECIMENTO', value: 172, color: '#00E5CF' },
      { name: 'TERAPIA_NUTRICIONAL', value: 153, color: '#00E5CF' },
      { name: 'IDENTIFICAÇÃO_PACIENTE', value: 141, color: '#00E5CF' },
      { name: 'EQUIPAMENTO', value: 119, color: '#00E5CF' },
      { name: 'SANGUE_OU_HEMOCOMP', value: 101, color: '#00E5CF' },
      { name: 'PERDA DE CATETER', value: 74, color: '#00E5CF' },
      { name: 'EXTUBAÇÃO', value: 64, color: '#00E5CF' },
      { name: 'INFECÇÕES RELACIONADAS', value: 52, color: '#00E5CF' },
      { name: 'ERRO DIAGNÓSTICO', value: 36, color: '#00E5CF' },
      { name: 'DESABASTECIMENTO_MED', value: 34, color: '#00E5CF' },
      { name: 'SANEANTES, COSMÉTICOS', value: 31, color: '#00E5CF' },
      { name: 'KITS E REAGENTES', value: 28, color: '#00E5CF' },
      { name: '(Em branco)', value: 5, color: '#00E5CF' },
      { name: 'TRANSPLANTE', value: 4, color: '#00E5CF' },
      { name: 'REGISTRO DE ENFERMAGEM', value: 2, color: '#00E5CF' },
      { name: 'TROMBOEMBOLISMO', value: 1, color: '#00E5CF' }
    ];

    if (period !== 'Todos') {
      const factor = period === 'Último mês' ? 0.08 : 
                    period === 'Últimos 3 meses' ? 0.25 :
                    period === 'Últimos 6 meses' ? 0.5 : 1;
      
      const filteredData = mockData.map(item => ({
        ...item,
        value: Math.round(item.value * factor)
      }));
      
      setData(filteredData);
    } else {
      setData(mockData);
    }
  }, [period]);

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis 
            type="number" 
            domain={[0, 'dataMax']}
            tickFormatter={(value) => value >= 1000 ? `${value / 1000}k` : value}
          />
          <YAxis 
            type="category" 
            dataKey="name" 
            tick={{ fontSize: 10 }}
            width={120}
          />
          <Tooltip formatter={(value) => [`${value}`, 'Quantidade']} />
          <Bar 
            dataKey="value" 
            name="Quantidade" 
            barSize={16}
            radius={[0, 4, 4, 0]}
            fill="#00E5CF"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ThemeChart;