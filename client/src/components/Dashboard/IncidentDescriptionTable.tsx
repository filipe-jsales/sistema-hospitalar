import React from "react";
import { IonItem, IonLabel, IonList, IonSpinner, IonChip, IonIcon } from "@ionic/react";
import { closeCircle } from "ionicons/icons";
import { useAppSelector } from "../../hooks/useRedux";
import { useTypedDispatch } from "../../hooks/useRedux";
import { 
  setNotificationFilters,
  fetchNotifications
} from "../../store/slices/notification/fetchNotificationsSlice";

const IncidentDescriptionTable: React.FC = () => {
  const dispatch = useTypedDispatch();
  const { 
    notifications, 
    loading: notificationsLoading,
    activeFilters
  } = useAppSelector((state) => state.notifications);

  const displayedNotifications = notifications.slice(0, 10);

  const handleNotificationClick = (notification: any) => {
    if (activeFilters.notificationId === notification.id) {
      const newFilters = { ...activeFilters };
      delete newFilters.notificationId;
      
      dispatch(setNotificationFilters(newFilters));
      dispatch(fetchNotifications(newFilters));
    } else {
      const newFilters = {
        ...activeFilters,
        notificationId: notification.id,
        page: 1,
      };
      
      dispatch(setNotificationFilters(newFilters));
      dispatch(fetchNotifications(newFilters));
    }
  };

  const hasActiveFilter = activeFilters.notificationId !== undefined;
  
  const filteredNotificationDescription = hasActiveFilter ? 
    notifications.find(n => n.id === activeFilters.notificationId)?.description : null;

  return (
    <>
      {hasActiveFilter && (
        <div className="filter-indicator" style={{ marginBottom: '10px' }}>
          <IonChip outline color="primary">
            <IonLabel>Filtrando: {filteredNotificationDescription?.substring(0, 20)}...</IonLabel>
            <IonIcon 
              icon={closeCircle} 
              onClick={() => {
                const newFilters = { ...activeFilters };
                delete newFilters.notificationId;
                dispatch(setNotificationFilters(newFilters));
                dispatch(fetchNotifications(newFilters));
              }} 
            />
          </IonChip>
        </div>
      )}
      
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
                className={
                  `${index % 2 === 0 ? "even-row" : "odd-row"} 
                   ${activeFilters.notificationId === notification.id ? "active-row" : ""}`
                }
                button
                onClick={() => handleNotificationClick(notification)}
                detail={false}
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