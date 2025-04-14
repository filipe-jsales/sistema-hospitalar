import React, { useState } from 'react';
import { 
  IonAccordion, 
  IonAccordionGroup, 
  IonCheckbox, 
  IonItem, 
  IonLabel, 
  IonList 
} from '@ionic/react';
import { AVAILABLE_YEARS, MONTHS, PeriodSelectorProps } from '../../utils/types';
import './PeriodSelector.css';

const PeriodSelector: React.FC<PeriodSelectorProps> = ({ selectedFilter, onFilterChange }) => {
  const [expandedYears, setExpandedYears] = useState<number[]>([]);

  const toggleYearExpansion = (year: number) => {
    if (expandedYears.includes(year)) {
      setExpandedYears(expandedYears.filter(y => y !== year));
    } else {
      setExpandedYears([...expandedYears, year]);
    }
  };

  const handleAllSelection = () => {
    if (!selectedFilter.year && (!selectedFilter.months || selectedFilter.months.length === 0)) {
      return;
    }
    
    onFilterChange({});
  };

  const handleYearSelection = (year: number) => {
    const isYearSelected = selectedFilter.year === year && 
                          (!selectedFilter.months || selectedFilter.months.length === 0);
    
    if (isYearSelected) {
      onFilterChange({});
    } else {
      onFilterChange({ year });
      
      if (!expandedYears.includes(year)) {
        toggleYearExpansion(year);
      }
    }
  };

  const handleMonthSelection = (year: number, month: number) => {
    const currentMonths = selectedFilter.year === year ? selectedFilter.months || [] : [];
    const isMonthSelected = currentMonths.includes(month);
    
    let newMonths: number[];
    
    if (isMonthSelected) {
      newMonths = currentMonths.filter(m => m !== month);
    } else {
      newMonths = [...currentMonths, month];
    }
    
    onFilterChange({
      year,
      months: newMonths.length > 0 ? newMonths : undefined
    });
  };

  const isAllSelected = !selectedFilter.year && (!selectedFilter.months || selectedFilter.months.length === 0);
  
  return (
    <div className="period-selector-container">
      <div className="card-title">PERÍODO AVALIADO</div>
      
      <IonList className="period-selector-list">
        <IonItem lines="full">
          <IonCheckbox 
            checked={isAllSelected}
            onIonChange={() => handleAllSelection()}
          />
          <IonLabel className="ion-padding-start">Todos</IonLabel>
        </IonItem>
        
        <IonAccordionGroup>
          {AVAILABLE_YEARS.map(year => (
            <IonAccordion key={year} value={year.toString()}>
              <IonItem slot="header">
                <IonCheckbox 
                  checked={selectedFilter.year === year && (!selectedFilter.months || selectedFilter.months.length === 0)}
                  onIonChange={() => handleYearSelection(year)}
                  onClick={(e) => e.stopPropagation()}
                />
                <IonLabel className="ion-padding-start">{year}</IonLabel>
              </IonItem>
              
              <div slot="content" className="month-list">
                {MONTHS.map(month => (
                  <IonItem key={`${year}-${month.value}`} lines="full">
                    <IonCheckbox 
                      checked={selectedFilter.year === year && selectedFilter.months?.includes(month.value)}
                      onIonChange={() => handleMonthSelection(year, month.value)}
                    />
                    <IonLabel className="ion-padding-start">{month.label}</IonLabel>
                  </IonItem>
                ))}
              </div>
            </IonAccordion>
          ))}
        </IonAccordionGroup>
      </IonList>
    </div>
  );
};

export default PeriodSelector;