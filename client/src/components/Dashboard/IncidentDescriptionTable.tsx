import React from "react";
import { IonLabel, IonSpinner, IonChip, IonIcon } from "@ionic/react";
import { closeCircle } from "ionicons/icons";
import { useAppSelector } from "../../hooks/useRedux";
import { useTypedDispatch } from "../../hooks/useRedux";
import {
  setNotificationFilters,
  fetchNotifications,
} from "../../store/slices/notification/fetchNotificationsSlice";
import "./IncidentDescriptionTable.css";

const IncidentDescriptionTable: React.FC = () => {
  const dispatch = useTypedDispatch();
  const {
    notifications,
    loading: notificationsLoading,
    activeFilters,
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

  const filteredNotificationDescription = hasActiveFilter
    ? notifications.find((n) => n.id === activeFilters.notificationId)
        ?.description
    : null;

  return (
    <>
      {hasActiveFilter && (
        <div className="filter-indicator" style={{ marginBottom: "10px" }}>
          <IonChip outline color="primary">
            <IonLabel>
              Filtrando: {filteredNotificationDescription?.substring(0, 20)}...
            </IonLabel>
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
        <div className="incident-table-container">
          <table className="incident-table">
            <thead>
              <tr>
                <th>DESCRIÇÃO</th>
              </tr>
            </thead>
            <tbody>
              {displayedNotifications.length > 0 ? (
                displayedNotifications.map((notification, index) => (
                  <tr
                    key={notification.id || index}
                    className={
                      activeFilters.notificationId === notification.id
                        ? "active-row"
                        : ""
                    }
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <td>{notification.description || "Sem descrição"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="ion-text-center">
                    Nenhuma notificação encontrada para o período selecionado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default IncidentDescriptionTable;
