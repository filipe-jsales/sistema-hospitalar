import { NotificationData } from "../store/slices/notification/fetchNotificationsSlice";

export type PeriodType =
  | "Todos"
  | "Último mês"
  | "Últimos 3 meses"
  | "Últimos 6 meses"
  | "Último ano";

export interface PeriodProps {
  period: PeriodType;
}

export interface PeriodSelectorProps {
  selectedPeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}

export const filterNotificationsByPeriod = (
  notifications: NotificationData[],
  period: PeriodType
): NotificationData[] => {
  if (period === "Todos") {
    return notifications;
  }

  const now = new Date();
  let dateLimit = new Date();

  switch (period) {
    case "Último mês":
      dateLimit.setMonth(now.getMonth() - 1);
      break;
    case "Últimos 3 meses":
      dateLimit.setMonth(now.getMonth() - 3);
      break;
    case "Últimos 6 meses":
      dateLimit.setMonth(now.getMonth() - 6);
      break;
    case "Último ano":
      dateLimit.setFullYear(now.getFullYear() - 1);
      break;
  }

  return notifications.filter((notification) => {
    const createdAt = notification.createdAt
      ? new Date(notification.createdAt)
      : null;
    return createdAt && createdAt >= dateLimit;
  });
};

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface PieData extends ChartData {
  percentage: number;
}

export const PERIODS: PeriodType[] = [
  "Todos",
  "Último mês",
  "Últimos 3 meses",
  "Últimos 6 meses",
  "Último ano",
];
