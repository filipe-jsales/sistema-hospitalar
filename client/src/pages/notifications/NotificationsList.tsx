import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonButton,
  IonSpinner,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonItem,
  IonLabel,
  IonList,
  IonChip,
  IonIcon,
  IonSearchbar,
  IonRefresher,
  IonRefresherContent,
  IonAlert,
  IonToast,
} from "@ionic/react";
import { useState, useEffect } from "react";
import { RefresherEventDetail } from "@ionic/core";
import { createOutline, trashOutline, notifications, notificationsCircle } from "ionicons/icons";
import { useHistory } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  clearNotificationError,
  clearNotifications,
  fetchNotifications,
  NotificationData,
} from "../../store/slices/notification/fetchNotificationsSlice";
import {
  deleteNotification,
  resetDeleteStatus,
} from "../../store/slices/notification/deleteNotificationSlice";

const NotificationsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { notifications, loading, error } = useAppSelector(
    (state) => state.notifications
  );

  const {
    loading: deleteLoading,
    error: deleteError,
    success: deleteSuccess,
  } = useAppSelector((state) => state.deleteNotification);

  const [searchText, setSearchText] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    loadNotifications();

    return () => {
      dispatch(clearNotifications());
      dispatch(clearNotificationError());
      dispatch(resetDeleteStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      setToastMessage("Notificação excluída com sucesso!");
      setShowToast(true);
      loadNotifications();
      dispatch(resetDeleteStatus());
    }

    if (deleteError) {
      setToastMessage(deleteError);
      setShowToast(true);
    }
  }, [deleteSuccess, deleteError, dispatch]);

  const loadNotifications = () => {
    dispatch(fetchNotifications())
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar notificações:", error);
      });
  };

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    dispatch(fetchNotifications())
      .unwrap()
      .finally(() => {
        event.detail.complete();
      });
  };

  const handleEdit = (notification: NotificationData) => {
    history.push(`/notifications/edit/${notification.id}`);
  };

  const handleDelete = (notification: NotificationData) => {
    setSelectedNotification(notification);
    setShowAlert(true);
  };

  const confirmDelete = () => {
    if (selectedNotification) {
      dispatch(deleteNotification(selectedNotification.id));
      setShowAlert(false);
      setSelectedNotification(null);
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    const description = notification.description.toLowerCase();
    const searchLower = searchText.toLowerCase();

    return description.includes(searchLower);
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Sistema de Notificações</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="m-2 row justify-content-center align-items-center mt-6">
          <IonCard style={{ width: "90%", maxWidth: "45rem" }}>
            <h1 className="text-center text-uppercase fw-bold">
              Listagem de Notificações
            </h1>

            <IonCardContent>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <IonSearchbar
                  value={searchText}
                  onIonInput={(e) => setSearchText(e.detail.value || "")}
                  placeholder="Buscar notificações"
                />

                <IonButton
                  color="primary"
                  routerLink="/notifications/create"
                  className="ms-2"
                >
                  Nova Notificação
                </IonButton>
              </div>

              {loading ? (
                <div className="text-center p-3">
                  <IonSpinner name="crescent" />
                  <p>Carregando notificações...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger col-12 text-center">
                  {error}
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="alert alert-info col-12 text-center">
                  {searchText
                    ? "Nenhuma notificação encontrada com esta busca."
                    : "Nenhuma notificação cadastrada."}
                </div>
              ) : (
                <IonList>
                  {filteredNotifications.map(
                    (notification: NotificationData) => (
                      <IonItem key={notification.id} className="mb-2">
                        <div className="d-flex w-100 justify-content-between align-items-center">
                          <div>
                            <IonLabel>
                              <h2>{notification.description}</h2>
                              <p className="text-muted">
                                ID: {notification.id}
                              </p>
                            </IonLabel>
                          </div>

                          <div className="d-flex align-items-center">
                            <IonChip color="primary">
                              <IonIcon icon={notificationsCircle} />
                              <IonLabel>Notificação</IonLabel>
                            </IonChip>

                            <IonButton
                              fill="clear"
                              color="primary"
                              onClick={() => handleEdit(notification)}
                            >
                              <IonIcon slot="icon-only" icon={createOutline} />
                            </IonButton>

                            <IonButton
                              fill="clear"
                              color="danger"
                              onClick={() => handleDelete(notification)}
                            >
                              <IonIcon slot="icon-only" icon={trashOutline} />
                            </IonButton>
                          </div>
                        </div>
                      </IonItem>
                    )
                  )}
                </IonList>
              )}

              {!loading && !error && notifications.length > 0 && (
                <div className="text-center mt-3">
                  <p>Total de notificações: {notifications.length}</p>
                </div>
              )}
            </IonCardContent>
          </IonCard>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Confirmar exclusão"
          message={`Tem certeza que deseja excluir a notificação "${selectedNotification?.id}"?`}
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
              handler: () => {
                setSelectedNotification(null);
              },
            },
            {
              text: "Excluir",
              handler: confirmDelete,
            },
          ]}
        />
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="bottom"
          color={deleteSuccess ? "success" : "danger"}
        />
      </IonContent>
    </IonPage>
  );
};

export default NotificationsList;
