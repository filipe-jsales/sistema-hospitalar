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
  clearHospitalError,
  clearHospitals,
  fetchHospitals,
  HospitalData,
} from "../../store/slices/hospital/fetchHospitalsSlice";
import {
  deleteHospital,
  resetDeleteStatus,
} from "../../store/slices/hospital/deleteHospitalSlice";

const HospitalsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { hospitals, loading, error } = useAppSelector(
    (state) => state.hospitals
  );

  const {
    loading: deleteLoading,
    error: deleteError,
    success: deleteSuccess,
  } = useAppSelector((state) => state.deleteHospital);

  const [searchText, setSearchText] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<HospitalData | null>(
    null
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    loadHospitals();

    return () => {
      dispatch(clearHospitals());
      dispatch(clearHospitalError());
      dispatch(resetDeleteStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      setToastMessage("Hospital excluído com sucesso!");
      setShowToast(true);
      loadHospitals();
      dispatch(resetDeleteStatus());
    }

    if (deleteError) {
      setToastMessage(deleteError);
      setShowToast(true);
    }
  }, [deleteSuccess, deleteError, dispatch]);

  const loadHospitals = () => {
    dispatch(fetchHospitals())
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar hospitais:", error);
      });
  };

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    dispatch(fetchHospitals())
      .unwrap()
      .finally(() => {
        event.detail.complete();
      });
  };

  const handleEdit = (hospital: HospitalData) => {
    history.push(`/hospitals/edit/${hospital.id}`);
  };

  const handleDelete = (hospital: HospitalData) => {
    setSelectedHospital(hospital);
    setShowAlert(true);
  };

  const confirmDelete = () => {
    if (selectedHospital) {
      dispatch(deleteHospital(selectedHospital.id));
      console.log("Delete hospital:", selectedHospital);
      setShowAlert(false);
      setSelectedHospital(null);
    }
  };
  const filteredHospitals = hospitals.filter((hospital) => {
    const name = hospital.name.toLowerCase();
    const searchLower = searchText.toLowerCase();

    return name.includes(searchLower);
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Sistema Hospitalar</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="m-2 row justify-content-center align-items-center mt-6">
          <IonCard style={{ width: "90%", maxWidth: "45rem" }}>
            <h1 className="text-center text-uppercase fw-bold">
              Listagem de Hospitais
            </h1>

            <IonCardContent>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <IonSearchbar
                  value={searchText}
                  onIonInput={(e) => setSearchText(e.detail.value || "")}
                  placeholder="Buscar hospitais"
                />

                <IonButton
                  color="primary"
                  routerLink="/hospitals/create"
                  className="ms-2"
                >
                  Novo Hospital
                </IonButton>
              </div>

              {loading ? (
                <div className="text-center p-3">
                  <IonSpinner name="crescent" />
                  <p>Carregando hospitais...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger col-12 text-center">
                  {error}
                </div>
              ) : filteredHospitals.length === 0 ? (
                <div className="alert alert-info col-12 text-center">
                  {searchText
                    ? "Nenhum hospital encontrado com esta busca."
                    : "Nenhum hospital cadastrado."}
                </div>
              ) : (
                <IonList>
                  {filteredHospitals.map((hospital: HospitalData) => (
                    <IonItem key={hospital.id} className="mb-2">
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <div>
                          <IonLabel>
                            <h2>{hospital.name}</h2>
                            <p>ID: {hospital.id}</p>
                          </IonLabel>
                        </div>

                        <div className="d-flex align-items-center">
                          <IonChip color="primary">
                            <IonIcon icon={business} />
                            <IonLabel>Hospital</IonLabel>
                          </IonChip>

                          <IonButton
                            fill="clear"
                            color="primary"
                            onClick={() => handleEdit(hospital)}
                          >
                            <IonIcon slot="icon-only" icon={createOutline} />
                          </IonButton>

                          <IonButton
                            fill="clear"
                            color="danger"
                            onClick={() => handleDelete(hospital)}
                          >
                            <IonIcon slot="icon-only" icon={trashOutline} />
                          </IonButton>
                        </div>
                      </div>
                    </IonItem>
                  ))}
                </IonList>
              )}

              {!loading && !error && hospitals.length > 0 && (
                <div className="text-center mt-3">
                  <p>Total de hospitais: {hospitals.length}</p>
                </div>
              )}
            </IonCardContent>
          </IonCard>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Confirmar exclusão"
          message={`Tem certeza que deseja excluir o hospital ${selectedHospital?.name}?`}
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
              handler: () => {
                setSelectedHospital(null);
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

export default HospitalsList;
