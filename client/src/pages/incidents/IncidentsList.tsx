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
import { createOutline, trashOutline, business } from "ionicons/icons";
import { useHistory } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

import {
  clearIncidentError,
  clearIncidents,
  fetchIncidents,
  IncidentData,
} from "../../store/slices/incident/fetchIncidentsSlice";
import { deleteIncident, resetDeleteStatus } from "../../store/slices/incident/deleteIncidentSlice";
import Header from "../../components/Header/Header";

const IncidentsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { incidents, loading, error } = useAppSelector(
    (state) => state.incidents
  );

  const {
    loading: deleteLoading,
    error: deleteError,
    success: deleteSuccess,
  } = useAppSelector((state) => state.deleteIncident);

  const [searchText, setSearchText] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<IncidentData | null>(
    null
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    loadIncidents();

    return () => {
      dispatch(clearIncidents());
      dispatch(clearIncidentError());
      dispatch(resetDeleteStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      setToastMessage("Incidente excluído com sucesso!");
      setShowToast(true);
      loadIncidents();
      dispatch(resetDeleteStatus());
    }

    if (deleteError) {
      setToastMessage(deleteError);
      setShowToast(true);
    }
  }, [deleteSuccess, deleteError, dispatch]);

  const loadIncidents = () => {
    dispatch(fetchIncidents())
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar hospitais:", error);
      });
  };

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    dispatch(fetchIncidents())
      .unwrap()
      .finally(() => {
        event.detail.complete();
      });
  };

  const handleEdit = (incident: IncidentData) => {
    history.push(`/incidents/edit/${incident.id}`);
  };

  const handleDelete = (incident: IncidentData) => {
    setSelectedIncident(incident);
    setShowAlert(true);
  };

  const confirmDelete = () => {
    if (selectedIncident) {
      dispatch(deleteIncident(selectedIncident.id));
      setShowAlert(false);
      setSelectedIncident(null);
    }
  };
  const filteredIncidents = incidents.filter((incident) => {
    const name = incident.name.toLowerCase();
    const searchLower = searchText.toLowerCase();

    return name.includes(searchLower);
  });

  return (
    <IonPage>
      <Header/>
      {/* TODO: ^ create a component for this header */}

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="m-2 row justify-content-center align-items-center mt-6">
          <IonCard style={{ width: "90%", maxWidth: "45rem" }}>
            <h1 className="text-center text-uppercase fw-bold">
              Listagem de Incidentes
            </h1>

            <IonCardContent>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <IonSearchbar
                  value={searchText}
                  onIonInput={(e) => setSearchText(e.detail.value || "")}
                  placeholder="Buscar incidentes"
                />

                <IonButton
                  color="primary"
                  routerLink="/incidents/create"
                  className="ms-2"
                >
                  Novo Incidente
                </IonButton>
              </div>

              {loading ? (
                <div className="text-center p-3">
                  <IonSpinner name="crescent" />
                  <p>Carregando incidentes...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger col-12 text-center">
                  {error}
                </div>
              ) : filteredIncidents.length === 0 ? (
                <div className="alert alert-info col-12 text-center">
                  {searchText
                    ? "Nenhum Incidente encontrado com esta busca."
                    : "Nenhum Incidente cadastrado."}
                </div>
              ) : (
                <IonList>
                  {filteredIncidents.map((incident: IncidentData) => (
                    <IonItem key={incident.id} className="mb-2">
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <div>
                          <IonLabel>
                            <h2>{incident.name}</h2>
                            <p>ID: {incident.id}</p>
                          </IonLabel>
                        </div>

                        <div className="d-flex align-items-center">
                          <IonChip color="primary">
                            <IonIcon icon={business} />
                            <IonLabel>Incidente</IonLabel>
                          </IonChip>

                          <IonButton
                            fill="clear"
                            color="primary"
                            onClick={() => handleEdit(incident)}
                          >
                            <IonIcon slot="icon-only" icon={createOutline} />
                          </IonButton>

                          <IonButton
                            fill="clear"
                            color="danger"
                            onClick={() => handleDelete(incident)}
                          >
                            <IonIcon slot="icon-only" icon={trashOutline} />
                          </IonButton>
                        </div>
                      </div>
                    </IonItem>
                  ))}
                </IonList>
              )}

              {!loading && !error && incidents.length > 0 && (
                <div className="text-center mt-3">
                  <p>Total de incidentes: {incidents.length}</p>
                </div>
              )}
            </IonCardContent>
          </IonCard>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Confirmar exclusão"
          message={`Tem certeza que deseja excluir o incidente ${selectedIncident?.name}?`}
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
              handler: () => {
                setSelectedIncident(null);
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

export default IncidentsList;
