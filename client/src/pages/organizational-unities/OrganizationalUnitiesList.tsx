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
import { createOutline, trashOutline, business } from "ionicons/icons";
import { useHistory } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  clearOrganizationalUnityError,
  clearOrganizationalUnities,
  fetchOrganizationalUnities,
  OrganizationalUnityData,
} from "../../store/slices/organizationalUnity/fetchOrganizationalUnitiesSlice";
import {
  deleteOrganizationalUnity,
  resetDeleteStatus,
} from "../../store/slices/organizationalUnity/deleteOrganizationalUnitySlice";
import Header from "../../components/Header/Header";

const OrganizationalUnitiesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { organizationalUnities, loading, error, pagination } = useAppSelector(
    (state) => state.organizationalUnities
  );

  const { error: deleteError, success: deleteSuccess } = useAppSelector(
    (state) => state.deleteOrganizationalUnity
  );

  const [searchText, setSearchText] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [selectedOrganizationalUnity, setSelectedOrganizationalUnity] =
    useState<OrganizationalUnityData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadOrganizationalUnities(1);

    return () => {
      dispatch(clearOrganizationalUnities());
      dispatch(clearOrganizationalUnityError());
      dispatch(resetDeleteStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      setToastMessage("Unidade Organizacional excluída com sucesso!");
      setShowToast(true);
      loadOrganizationalUnities(currentPage);
      dispatch(resetDeleteStatus());
    }

    if (deleteError) {
      setToastMessage(deleteError);
      setShowToast(true);
    }
  }, [deleteSuccess, deleteError, dispatch, currentPage]);

  const loadOrganizationalUnities = (page: number) => {
    dispatch(fetchOrganizationalUnities({ page }))
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar unidades organizacionais:", error);
      });
  };

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    dispatch(fetchOrganizationalUnities({ page: currentPage }))
      .unwrap()
      .finally(() => {
        event.detail.complete();
      });
  };

  const handleEdit = (organizationalUnity: OrganizationalUnityData) => {
    history.push(`/organizational-unities/edit/${organizationalUnity.id}`);
  };

  const handleDelete = (organizationalUnity: OrganizationalUnityData) => {
    setSelectedOrganizationalUnity(organizationalUnity);
    setShowAlert(true);
  };

  const confirmDelete = () => {
    if (selectedOrganizationalUnity) {
      dispatch(deleteOrganizationalUnity(selectedOrganizationalUnity.id));
      setShowAlert(false);
      setSelectedOrganizationalUnity(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
      loadOrganizationalUnities(newPage);
    }
  };

  // Garantir que organizationalUnities é sempre um array antes de filtrar
  const organizationalUnitiesArray = Array.isArray(organizationalUnities)
    ? organizationalUnities
    : [];

  const filteredOrganizationalUnities = organizationalUnitiesArray.filter(
    (organizationalUnity) => {
      if (!organizationalUnity || !organizationalUnity.name) return false;
      const name = organizationalUnity.name.toLowerCase();
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
              Listagem de Unidades Organizacionais
            </h1>

            <IonCardContent>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <IonSearchbar
                  value={searchText}
                  onIonInput={(e) => setSearchText(e.detail.value || "")}
                  placeholder="Buscar unidades organizacionais"
                />

                <IonButton
                  color="primary"
                  routerLink="/organizational-unities/create"
                  className="ms-2"
                >
                  Nova Unidade Organizacional
                </IonButton>
              </div>

              {loading ? (
                <div className="text-center p-3">
                  <IonSpinner name="crescent" />
                  <p>Carregando unidades organizacionais...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger col-12 text-center">
                  {error}
                </div>
              ) : filteredOrganizationalUnities.length === 0 ? (
                <div className="alert alert-info col-12 text-center">
                  {searchText
                    ? "Nenhuma unidade organizacional encontrada com esta busca."
                    : "Nenhuma unidade organizacional cadastrada."}
                </div>
              ) : (
                <IonList>
                  {filteredOrganizationalUnities.map(
                    (organizationalUnity: OrganizationalUnityData) => (
                      <IonItem key={organizationalUnity.id} className="mb-2">
                        <div className="d-flex w-100 justify-content-between align-items-center">
                          <div>
                            <IonLabel>
                              <h2>{organizationalUnity.name}</h2>
                              <p>ID: {organizationalUnity.id}</p>
                            </IonLabel>
                          </div>

                          <div className="d-flex align-items-center">
                            <IonChip color="primary">
                              <IonIcon icon={business} />
                              <IonLabel>Unidade Organizacional</IonLabel>
                            </IonChip>

                            <IonButton
                              fill="clear"
                              color="primary"
                              onClick={() => handleEdit(organizationalUnity)}
                            >
                              <IonIcon slot="icon-only" icon={createOutline} />
                            </IonButton>

                            <IonButton
                              fill="clear"
                              color="danger"
                              onClick={() => handleDelete(organizationalUnity)}
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

              {!loading && !error && pagination && (
                <div className="text-center mt-3">
                  <p>
                    Exibindo {filteredOrganizationalUnities.length} de{" "}
                    {pagination.totalItems} unidades organizacionais
                    {searchText && " (filtradas)"}
                  </p>

                  {pagination.totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-3">
                      <IonButton
                        fill="clear"
                        disabled={currentPage === 1}
                        onClick={() =>
                          handlePageChange(Math.max(1, currentPage - 1))
                        }
                      >
                        Anterior
                      </IonButton>

                      <div className="d-flex align-items-center mx-2">
                        <span>
                          Página {currentPage} de {pagination.totalPages}
                        </span>
                      </div>

                      <IonButton
                        fill="clear"
                        disabled={currentPage === pagination.totalPages}
                        onClick={() =>
                          handlePageChange(
                            Math.min(pagination.totalPages, currentPage + 1)
                          )
                        }
                      >
                        Próxima
                      </IonButton>
                    </div>
                  )}
                </div>
              )}
            </IonCardContent>
          </IonCard>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Confirmar exclusão"
          message={`Tem certeza que deseja excluir a unidade organizacional ${selectedOrganizationalUnity?.name}?`}
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
              handler: () => {
                setSelectedOrganizationalUnity(null);
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

export default OrganizationalUnitiesList;
