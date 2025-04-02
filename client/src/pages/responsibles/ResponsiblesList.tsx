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
  import { createOutline, trashOutline, person } from "ionicons/icons";
  import { useHistory } from "react-router";
  import { useAppDispatch, useAppSelector } from "../../store/hooks";
  import {
    clearResponsibleError,
    clearResponsibles,
    fetchResponsibles,
    ResponsibleData,
  } from "../../store/slices/responsible/fetchResponsiblesSlice";
  import {
    deleteResponsible,
    resetDeleteStatus,
  } from "../../store/slices/responsible/deleteResponsibleSlice";
  
  const ResponsiblesList: React.FC = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { responsibles, loading, error } = useAppSelector(
      (state) => state.responsibles
    );
  
    const {
      loading: deleteLoading,
      error: deleteError,
      success: deleteSuccess,
    } = useAppSelector((state) => state.deleteResponsible);
  
    const [searchText, setSearchText] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [selectedResponsible, setSelectedResponsible] = useState<ResponsibleData | null>(
      null
    );
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
  
    useEffect(() => {
      loadResponsibles();
  
      return () => {
        dispatch(clearResponsibles());
        dispatch(clearResponsibleError());
        dispatch(resetDeleteStatus());
      };
    }, [dispatch]);
  
    useEffect(() => {
      if (deleteSuccess) {
        setToastMessage("Responsável excluído com sucesso!");
        setShowToast(true);
        loadResponsibles();
        dispatch(resetDeleteStatus());
      }
  
      if (deleteError) {
        setToastMessage(deleteError);
        setShowToast(true);
      }
    }, [deleteSuccess, deleteError, dispatch]);
  
    const loadResponsibles = () => {
      dispatch(fetchResponsibles())
        .unwrap()
        .catch((error) => {
          console.error("Falha ao carregar responsáveis:", error);
        });
    };
  
    const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
      dispatch(fetchResponsibles())
        .unwrap()
        .finally(() => {
          event.detail.complete();
        });
    };
  
    const handleEdit = (responsible: ResponsibleData) => {
      history.push(`/responsibles/edit/${responsible.id}`);
    };
  
    const handleDelete = (responsible: ResponsibleData) => {
      setSelectedResponsible(responsible);
      setShowAlert(true);
    };
  
    const confirmDelete = () => {
      if (selectedResponsible) {
        dispatch(deleteResponsible(selectedResponsible.id));
        setShowAlert(false);
        setSelectedResponsible(null);
      }
    };
    
    const filteredResponsibles = responsibles.filter((responsible) => {
      const name = responsible.name.toLowerCase();
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
            <IonTitle>Sistema de Responsáveis</IonTitle>
          </IonToolbar>
        </IonHeader>
  
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
  
          <div className="m-2 row justify-content-center align-items-center mt-6">
            <IonCard style={{ width: "90%", maxWidth: "45rem" }}>
              <h1 className="text-center text-uppercase fw-bold">
                Listagem de Responsáveis
              </h1>
  
              <IonCardContent>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <IonSearchbar
                    value={searchText}
                    onIonInput={(e) => setSearchText(e.detail.value || "")}
                    placeholder="Buscar responsáveis"
                  />
  
                  <IonButton
                    color="primary"
                    routerLink="/responsible/create"
                    className="ms-2"
                  >
                    Novo Responsável
                  </IonButton>
                </div>
  
                {loading ? (
                  <div className="text-center p-3">
                    <IonSpinner name="crescent" />
                    <p>Carregando responsáveis...</p>
                  </div>
                ) : error ? (
                  <div className="alert alert-danger col-12 text-center">
                    {error}
                  </div>
                ) : filteredResponsibles.length === 0 ? (
                  <div className="alert alert-info col-12 text-center">
                    {searchText
                      ? "Nenhum responsável encontrado com esta busca."
                      : "Nenhum responsável cadastrado."}
                  </div>
                ) : (
                  <IonList>
                    {filteredResponsibles.map((responsible: ResponsibleData) => (
                      <IonItem key={responsible.id} className="mb-2">
                        <div className="d-flex w-100 justify-content-between align-items-center">
                          <div>
                            <IonLabel>
                              <h2>{responsible.name}</h2>
                              <p>ID: {responsible.id}</p>
                              {responsible.email && <p>Email: {responsible.email}</p>}
                              {responsible.phone && <p>Telefone: {responsible.phone}</p>}
                              {responsible.department && <p>Departamento: {responsible.department}</p>}
                            </IonLabel>
                          </div>
  
                          <div className="d-flex align-items-center">
                            <IonChip color="primary">
                              <IonIcon icon={person} />
                              <IonLabel>Responsável</IonLabel>
                            </IonChip>
  
                            <IonButton
                              fill="clear"
                              color="primary"
                              onClick={() => handleEdit(responsible)}
                            >
                              <IonIcon slot="icon-only" icon={createOutline} />
                            </IonButton>
  
                            <IonButton
                              fill="clear"
                              color="danger"
                              onClick={() => handleDelete(responsible)}
                            >
                              <IonIcon slot="icon-only" icon={trashOutline} />
                            </IonButton>
                          </div>
                        </div>
                      </IonItem>
                    ))}
                  </IonList>
                )}
  
                {!loading && !error && responsibles.length > 0 && (
                  <div className="text-center mt-3">
                    <p>Total de responsáveis: {responsibles.length}</p>
                  </div>
                )}
              </IonCardContent>
            </IonCard>
          </div>
  
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header="Confirmar exclusão"
            message={`Tem certeza que deseja excluir o responsável ${selectedResponsible?.name}?`}
            buttons={[
              {
                text: "Cancelar",
                role: "cancel",
                handler: () => {
                  setSelectedResponsible(null);
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
  
  export default ResponsiblesList;