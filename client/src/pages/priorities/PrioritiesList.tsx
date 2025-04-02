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
  import { createOutline, trashOutline, alert } from "ionicons/icons";
  import { useHistory } from "react-router";
  import { useAppDispatch, useAppSelector } from "../../store/hooks";
  import {
    clearPriorityError,
    clearPriorities,
    fetchPriorities,
    PriorityData,
  } from "../../store/slices/priority/fetchPrioritiesSlice";
  import {
    deletePriority,
    resetDeleteStatus,
  } from "../../store/slices/priority/deletePrioritySlice";
  
  const PrioritiesList: React.FC = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    const { priorities, loading, error } = useAppSelector(
      (state) => state.priorities
    );
  
    const {
      loading: deleteLoading,
      error: deleteError,
      success: deleteSuccess,
    } = useAppSelector((state) => state.deletePriority);
  
    const [searchText, setSearchText] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [selectedPriority, setSelectedPriority] = useState<PriorityData | null>(
      null
    );
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
  
    useEffect(() => {
      loadPriorities();
  
      return () => {
        dispatch(clearPriorities());
        dispatch(clearPriorityError());
        dispatch(resetDeleteStatus());
      };
    }, [dispatch]);
  
    useEffect(() => {
      if (deleteSuccess) {
        setToastMessage("Prioridade excluída com sucesso!");
        setShowToast(true);
        loadPriorities();
        dispatch(resetDeleteStatus());
      }
  
      if (deleteError) {
        setToastMessage(deleteError);
        setShowToast(true);
      }
    }, [deleteSuccess, deleteError, dispatch]);
  
    const loadPriorities = () => {
      dispatch(fetchPriorities())
        .unwrap()
        .catch((error) => {
          console.error("Falha ao carregar prioridades:", error);
        });
    };
  
    const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
      dispatch(fetchPriorities())
        .unwrap()
        .finally(() => {
          event.detail.complete();
        });
    };
  
    const handleEdit = (priority: PriorityData) => {
      history.push(`/priorities/edit/${priority.id}`);
    };
  
    const handleDelete = (priority: PriorityData) => {
      setSelectedPriority(priority);
      setShowAlert(true);
    };
  
    const confirmDelete = () => {
      if (selectedPriority) {
        dispatch(deletePriority(selectedPriority.id));
        setShowAlert(false);
        setSelectedPriority(null);
      }
    };
    
    const filteredPriorities = priorities.filter((priority) => {
      const name = priority.name.toLowerCase();
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
            <IonTitle>Sistema de Prioridades</IonTitle>
          </IonToolbar>
        </IonHeader>
  
        <IonContent>
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent></IonRefresherContent>
          </IonRefresher>
  
          <div className="m-2 row justify-content-center align-items-center mt-6">
            <IonCard style={{ width: "90%", maxWidth: "45rem" }}>
              <h1 className="text-center text-uppercase fw-bold">
                Listagem de Prioridades
              </h1>
  
              <IonCardContent>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <IonSearchbar
                    value={searchText}
                    onIonInput={(e) => setSearchText(e.detail.value || "")}
                    placeholder="Buscar prioridades"
                  />
  
                  <IonButton
                    color="primary"
                    routerLink="/priorities/create"
                    className="ms-2"
                  >
                    Nova Prioridade
                  </IonButton>
                </div>
  
                {loading ? (
                  <div className="text-center p-3">
                    <IonSpinner name="crescent" />
                    <p>Carregando prioridades...</p>
                  </div>
                ) : error ? (
                  <div className="alert alert-danger col-12 text-center">
                    {error}
                  </div>
                ) : filteredPriorities.length === 0 ? (
                  <div className="alert alert-info col-12 text-center">
                    {searchText
                      ? "Nenhuma prioridade encontrada com esta busca."
                      : "Nenhuma prioridade cadastrada."}
                  </div>
                ) : (
                  <IonList>
                    {filteredPriorities.map((priority: PriorityData) => (
                      <IonItem key={priority.id} className="mb-2">
                        <div className="d-flex w-100 justify-content-between align-items-center">
                          <div>
                            <IonLabel>
                              <h2>{priority.name}</h2>
                              <p>ID: {priority.id}</p>
                            </IonLabel>
                          </div>
  
                          <div className="d-flex align-items-center">
                            <IonChip color="primary">
                              <IonIcon icon={alert} />
                              <IonLabel>Prioridade</IonLabel>
                            </IonChip>
  
                            <IonButton
                              fill="clear"
                              color="primary"
                              onClick={() => handleEdit(priority)}
                            >
                              <IonIcon slot="icon-only" icon={createOutline} />
                            </IonButton>
  
                            <IonButton
                              fill="clear"
                              color="danger"
                              onClick={() => handleDelete(priority)}
                            >
                              <IonIcon slot="icon-only" icon={trashOutline} />
                            </IonButton>
                          </div>
                        </div>
                      </IonItem>
                    ))}
                  </IonList>
                )}
  
                {!loading && !error && priorities.length > 0 && (
                  <div className="text-center mt-3">
                    <p>Total de prioridades: {priorities.length}</p>
                  </div>
                )}
              </IonCardContent>
            </IonCard>
          </div>
  
          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => setShowAlert(false)}
            header="Confirmar exclusão"
            message={`Tem certeza que deseja excluir a prioridade ${selectedPriority?.name}?`}
            buttons={[
              {
                text: "Cancelar",
                role: "cancel",
                handler: () => {
                  setSelectedPriority(null);
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
  
  export default PrioritiesList;