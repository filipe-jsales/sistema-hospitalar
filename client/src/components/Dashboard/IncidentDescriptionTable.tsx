import React, { useEffect, useState } from "react";
import { IonItem, IonLabel, IonList, IonSpinner } from "@ionic/react";
import { useAppSelector } from "../../hooks/useRedux";
import { NotificationData } from "../../store/slices/notification/fetchNotificationsSlice";

interface IncidentDescriptionTableProps {
  period: string;
}

const IncidentDescriptionTable: React.FC<IncidentDescriptionTableProps> = ({
  period,
}) => {
  const { notifications, loading: notificationsLoading } = useAppSelector(
    (state) => state.notifications
  );

  const [filteredNotifications, setFilteredNotifications] = useState<
    NotificationData[]
  >([]);

  useEffect(() => {
    if (notifications.length > 0) {
      if (period !== "Todos") {
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

        const filtered = notifications.filter((notification) => {
          const createdAt = notification.createdAt
            ? new Date(notification.createdAt)
            : null;
          return createdAt && createdAt >= dateLimit;
        });

        setFilteredNotifications(filtered.slice(0, 10));
      } else {
        setFilteredNotifications(notifications.slice(0, 10));
      }
    }
  }, [notifications, period]);

  return (
    <>
      {notificationsLoading ? (
        <div className="ion-text-center">
          <IonSpinner name="crescent" />
          <p>Carregando dados...</p>
        </div>
      ) : (
        <IonList className="incident-table">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification, index) => (
              <IonItem
                key={notification.id || index}
                className={index % 2 === 0 ? "even-row" : "odd-row"}
              >
                <IonLabel className="ion-text-wrap">
                  {notification.description || "Sem descrição"}
                </IonLabel>
              </IonItem>
            ))
          ) : (
            <IonItem>
              <IonLabel className="ion-text-center">
                Nenhuma notificação encontrada para o período selecionado.
              </IonLabel>
            </IonItem>
          )}
        </IonList>
      )}
    </>
  );
};

export default IncidentDescriptionTable;
