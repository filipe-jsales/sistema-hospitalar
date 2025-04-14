import React from "react";
import { IonItem, IonLabel, IonList, IonSpinner } from "@ionic/react";
import { useAppSelector } from "../../hooks/useRedux";

const IncidentDescriptionTable: React.FC = () => {
  const { notifications, loading: notificationsLoading } = useAppSelector(
    (state) => state.notifications
  );

  const displayedNotifications = notifications.slice(0, 10);

  return (
    <>
      {notificationsLoading ? (
        <div className="ion-text-center">
          <IonSpinner name="crescent" />
          <p>Carregando dados...</p>
        </div>
      ) : (
        <IonList className="incident-table">
          {displayedNotifications.length > 0 ? (
            displayedNotifications.map((notification, index) => (
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