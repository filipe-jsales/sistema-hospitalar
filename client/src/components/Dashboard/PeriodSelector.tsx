import React from "react";
import { IonSelect, IonSelectOption, IonLabel } from "@ionic/react";

interface PeriodSelectorProps {
  selectedPeriod: string;
  onPeriodChange: (period: string) => void;
}

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedPeriod,
  onPeriodChange,
}) => {
  const periodOptions = [
    "Todos",
    "Último mês",
    "Últimos 3 meses",
    "Últimos 6 meses",
    "Último ano",
  ];

  return (
    <div>
      <div className="card-title">PERÍODO AVALIADO</div>
      <IonSelect
        value={selectedPeriod}
        onIonChange={(e) => onPeriodChange(e.detail.value)}
        interface="popover"
        placeholder="Selecione um período"
        className="period-selector"
      >
        {periodOptions.map((period) => (
          <IonSelectOption key={period} value={period}>
            {period}
          </IonSelectOption>
        ))}
      </IonSelect>
    </div>
  );
};

export default PeriodSelector;
