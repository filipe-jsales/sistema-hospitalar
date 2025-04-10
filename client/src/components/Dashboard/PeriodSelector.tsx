import React from 'react';
import { IonSelect, IonSelectOption, IonLabel } from '@ionic/react';
import { PERIODS, PeriodSelectorProps } from '../../utils/types';

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ selectedPeriod, onPeriodChange }) => {

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
        {PERIODS.map((period) => (
          <IonSelectOption key={period} value={period}>
            {period}
          </IonSelectOption>
        ))}
      </IonSelect>
    </div>
  );
};

export default PeriodSelector;