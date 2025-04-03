import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonButton,
  IonSpinner,
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
import { createOutline, trashOutline, notifications } from "ionicons/icons";
import { useHistory } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  clearNotifyingServiceError,
  clearNotifyingServices,
  fetchNotifyingServices,
  NotifyingServiceData,
} from "../../store/slices/notifyingService/fetchNotifyingServicesSlice";
import {
  deleteNotifyingService,
  resetDeleteStatus,
} from "../../store/slices/notifyingService/deleteNotifyingServiceSlice";
import Header from "../../components/Header/Header";

const NotifyingServicesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { notifyingServices, loading, error } = useAppSelector(
    (state) => state.notifyingServices
  );

  const {
    loading: deleteLoading,
    error: deleteError,
    success: deleteSuccess,
  } = useAppSelector((state) => state.deleteNotifyingService);

  const [searchText, setSearchText] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [selectedNotifyingService, setSelectedNotifyingService] =
    useState<NotifyingServiceData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    loadNotifyingServices();

    return () => {
      dispatch(clearNotifyingServices());
      dispatch(clearNotifyingServiceError());
      dispatch(resetDeleteStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      setToastMessage("Serviço de notificação excluído com sucesso!");
      setShowToast(true);
      loadNotifyingServices();
      dispatch(resetDeleteStatus());
    }

    if (deleteError) {
      setToastMessage(deleteError);
      setShowToast(true);
    }
  }, [deleteSuccess, deleteError, dispatch]);

  const loadNotifyingServices = () => {
    dispatch(fetchNotifyingServices())
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar serviços de notificação:", error);
      });
  };

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    dispatch(fetchNotifyingServices())
      .unwrap()
      .finally(() => {
        event.detail.complete();
      });
  };

  const handleEdit = (notifyingService: NotifyingServiceData) => {
    history.push(`/notifying-services/edit/${notifyingService.id}`);
  };

  const handleDelete = (notifyingService: NotifyingServiceData) => {
    setSelectedNotifyingService(notifyingService);
    setShowAlert(true);
  };

  const confirmDelete = () => {
    if (selectedNotifyingService) {
      dispatch(deleteNotifyingService(selectedNotifyingService.id));
      setShowAlert(false);
      setSelectedNotifyingService(null);
    }
  };

  const filteredNotifyingServices = notifyingServices.filter(
    (notifyingService) => {
      const name = notifyingService.name.toLowerCase();
      const searchLower = searchText.toLowerCase();

      return name.includes(searchLower);
    }
  );

  return (
    <IonPage>
      <Header />

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="m-2 row justify-content-center align-items-center mt-6">
          <IonCard style={{ width: "90%", maxWidth: "45rem" }}>
            <h1 className="text-center text-uppercase fw-bold">
              Listagem de Serviços de Notificação
            </h1>

            <IonCardContent>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <IonSearchbar
                  value={searchText}
                  onIonInput={(e) => setSearchText(e.detail.value || "")}
                  placeholder="Buscar serviços"
                />

                <IonButton
                  color="primary"
                  routerLink="/notifying-services/create"
                  className="ms-2"
                >
                  Novo Serviço
                </IonButton>
              </div>

              {loading ? (
                <div className="text-center p-3">
                  <IonSpinner name="crescent" />
                  <p>Carregando serviços de notificação...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger col-12 text-center">
                  {error}
                </div>
              ) : filteredNotifyingServices.length === 0 ? (
                <div className="alert alert-info col-12 text-center">
                  {searchText
                    ? "Nenhum serviço de notificação encontrado com esta busca."
                    : "Nenhum serviço de notificação cadastrado."}
                </div>
              ) : (
                <IonList>
                  {filteredNotifyingServices.map(
                    (notifyingService: NotifyingServiceData) => (
                      <IonItem key={notifyingService.id} className="mb-2">
                        <div className="d-flex w-100 justify-content-between align-items-center">
                          <div>
                            <IonLabel>
                              <h2>{notifyingService.name}</h2>
                              <p>ID: {notifyingService.id}</p>
                            </IonLabel>
                          </div>

                          <div className="d-flex align-items-center">
                            <IonChip color="primary">
                              <IonIcon icon={notifications} />
                              <IonLabel>Notificação</IonLabel>
                            </IonChip>

                            <IonButton
                              fill="clear"
                              color="primary"
                              onClick={() => handleEdit(notifyingService)}
                            >
                              <IonIcon slot="icon-only" icon={createOutline} />
                            </IonButton>

                            <IonButton
                              fill="clear"
                              color="danger"
                              onClick={() => handleDelete(notifyingService)}
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

              {!loading && !error && notifyingServices.length > 0 && (
                <div className="text-center mt-3">
                  <p>
                    Total de serviços de notificação: {notifyingServices.length}
                  </p>
                </div>
              )}
            </IonCardContent>
          </IonCard>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Confirmar exclusão"
          message={`Tem certeza que deseja excluir o serviço de notificação ${selectedNotifyingService?.name}?`}
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
              handler: () => {
                setSelectedNotifyingService(null);
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

export default NotifyingServicesList;
