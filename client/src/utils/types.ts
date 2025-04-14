export interface PeriodFilter {
  year?: number;
  months?: number[];
}

export interface PeriodSelectorProps {
  selectedFilter: PeriodFilter;
  onFilterChange: (filter: PeriodFilter) => void;
}

export const AVAILABLE_YEARS = [2021, 2022, 2023, 2024, 2025];

export const MONTHS = [
  { value: 1, label: "janeiro" },
  { value: 2, label: "fevereiro" },
  { value: 3, label: "março" },
  { value: 4, label: "abril" },
  { value: 5, label: "maio" },
  { value: 6, label: "junho" },
  { value: 7, label: "julho" },
  { value: 8, label: "agosto" },
  { value: 9, label: "setembro" },
  { value: 10, label: "outubro" },
  { value: 11, label: "novembro" },
  { value: 12, label: "dezembro" }
];

export const getMonthName = (monthNumber: number): string => {
  const month = MONTHS.find(m => m.value === monthNumber);
  return month ? month.label : '';
};