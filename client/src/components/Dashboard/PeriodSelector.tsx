import React, { useState } from "react";
import {
  IonAccordion,
  IonAccordionGroup,
  IonCheckbox,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import {
  AVAILABLE_YEARS,
  MONTHS,
  PeriodSelectorProps,
} from "../../utils/types";

const PeriodSelector: React.FC<PeriodSelectorProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  const [expandedYears, setExpandedYears] = useState<number[]>([]);

  const toggleYearExpansion = (year: number) => {
    if (expandedYears.includes(year)) {
      setExpandedYears(expandedYears.filter((y) => y !== year));
    } else {
      setExpandedYears([...expandedYears, year]);
    }
  };

  const handleAllSelection = () => {
    if (
      !selectedFilter.year &&
      (!selectedFilter.months || selectedFilter.months.length === 0)
    ) {
      return;
    }

    onFilterChange({});
  };

  const handleYearSelection = (year: number) => {
    const isYearSelected =
      selectedFilter.year === year &&
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
    const currentMonths =
      selectedFilter.year === year ? selectedFilter.months || [] : [];
    const isMonthSelected = currentMonths.includes(month);

    let newMonths: number[];

    if (isMonthSelected) {
      newMonths = currentMonths.filter((m) => m !== month);
    } else {
      newMonths = [...currentMonths, month];
    }

    onFilterChange({
      year,
      months: newMonths.length > 0 ? newMonths : undefined,
    });
  };

  const isAllSelected =
    !selectedFilter.year &&
    (!selectedFilter.months || selectedFilter.months.length === 0);

  return (
    <div>
      <div className="fw-bold mb-2 text-center">PERÍODO AVALIADO</div>

      <IonList
        style={{ maxHeight: "200px", overflowY: "auto" }}
        className="ion-no-padding ion-no-margin"
      >
        <IonItem lines="full" className="p-0">
          <IonCheckbox
            checked={isAllSelected}
            onIonChange={() => handleAllSelection()}
            className="me-2"
            style={{ "--border-radius": "4px", "--size": "18px" }}
          />
          <IonLabel className="ps-2">Todos</IonLabel>
        </IonItem>

        <IonAccordionGroup>
          {AVAILABLE_YEARS.map((year) => (
            <IonAccordion
              key={year}
              value={year.toString()}
              className="border-bottom border-light"
            >
              <IonItem slot="header" className="p-0">
                <IonCheckbox
                  checked={
                    selectedFilter.year === year &&
                    (!selectedFilter.months ||
                      selectedFilter.months.length === 0)
                  }
                  onIonChange={() => handleYearSelection(year)}
                  onClick={(e) => e.stopPropagation()}
                  className="me-2"
                  style={{ "--border-radius": "4px", "--size": "18px" }}
                />
                <IonLabel className="ps-2">{year}</IonLabel>
              </IonItem>

              <div slot="content" className="ps-4">
                {MONTHS.map((month) => (
                  <IonItem
                    key={`${year}-${month.value}`}
                    lines="full"
                    className="p-0"
                  >
                    <IonCheckbox
                      checked={
                        selectedFilter.year === year &&
                        selectedFilter.months?.includes(month.value)
                      }
                      onIonChange={() =>
                        handleMonthSelection(year, month.value)
                      }
                      className="me-2"
                      style={{ "--border-radius": "4px", "--size": "18px" }}
                    />
                    <IonLabel className="ps-2">{month.label}</IonLabel>
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
