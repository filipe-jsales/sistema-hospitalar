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
import { createOutline, trashOutline, list } from "ionicons/icons";
import { useHistory } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  clearSubcategoryError,
  clearSubcategories,
  fetchSubcategories,
  SubcategoryData,
} from "../../store/slices/subcategory/fetchSubcategoriesSlice";
import {
  deleteSubcategory,
  resetDeleteStatus,
} from "../../store/slices/subcategory/deleteSubcategorySlice";
import Header from "../../components/Header/Header";

const SubcategoriesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { subcategories, loading, error } = useAppSelector(
    (state) => state.subcategories
  );

  const { error: deleteError, success: deleteSuccess } = useAppSelector(
    (state) => state.deleteSubcategory
  );

  const [searchText, setSearchText] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<SubcategoryData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    loadSubcategories();

    return () => {
      dispatch(clearSubcategories());
      dispatch(clearSubcategoryError());
      dispatch(resetDeleteStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      setToastMessage("Subcategoria excluída com sucesso!");
      setShowToast(true);
      loadSubcategories();
      dispatch(resetDeleteStatus());
    }

    if (deleteError) {
      setToastMessage(deleteError);
      setShowToast(true);
    }
  }, [deleteSuccess, deleteError, dispatch]);

  const loadSubcategories = () => {
    dispatch(fetchSubcategories({ page: 1 }))
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar subcategorias:", error);
      });
  };

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    dispatch(fetchSubcategories({ page: 1 }))
      .unwrap()
      .finally(() => {
        event.detail.complete();
      });
  };

  const handleEdit = (subcategory: SubcategoryData) => {
    history.push(`/subcategories/edit/${subcategory.id}`);
  };

  const handleDelete = (subcategory: SubcategoryData) => {
    setSelectedSubcategory(subcategory);
    setShowAlert(true);
  };

  const confirmDelete = () => {
    if (selectedSubcategory) {
      dispatch(deleteSubcategory(selectedSubcategory.id));
      setShowAlert(false);
      setSelectedSubcategory(null);
    }
  };

  const filteredSubcategories = subcategories.filter((subcategory) => {
    const name = subcategory.name.toLowerCase();
    const searchLower = searchText.toLowerCase();

    return name.includes(searchLower);
  });

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
              Listagem de Subcategorias
            </h1>

            <IonCardContent>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <IonSearchbar
                  value={searchText}
                  onIonInput={(e) => setSearchText(e.detail.value || "")}
                  placeholder="Buscar subcategorias"
                />

                <IonButton
                  color="primary"
                  routerLink="/subcategories/create"
                  className="ms-2"
                >
                  Nova Subcategoria
                </IonButton>
              </div>

              {loading ? (
                <div className="text-center p-3">
                  <IonSpinner name="crescent" />
                  <p>Carregando subcategorias...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger col-12 text-center">
                  {error}
                </div>
              ) : filteredSubcategories.length === 0 ? (
                <div className="alert alert-info col-12 text-center">
                  {searchText
                    ? "Nenhuma subcategoria encontrada com esta busca."
                    : "Nenhuma subcategoria cadastrada."}
                </div>
              ) : (
                <IonList>
                  {filteredSubcategories.map((subcategory: SubcategoryData) => (
                    <IonItem key={subcategory.id} className="mb-2">
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <div>
                          <IonLabel>
                            <h2>{subcategory.name}</h2>
                            <p>ID: {subcategory.id}</p>
                          </IonLabel>
                        </div>

                        <div className="d-flex align-items-center">
                          <IonChip color="primary">
                            <IonIcon icon={list} />
                            <IonLabel>Subcategoria</IonLabel>
                          </IonChip>

                          <IonButton
                            fill="clear"
                            color="primary"
                            onClick={() => handleEdit(subcategory)}
                          >
                            <IonIcon slot="icon-only" icon={createOutline} />
                          </IonButton>

                          <IonButton
                            fill="clear"
                            color="danger"
                            onClick={() => handleDelete(subcategory)}
                          >
                            <IonIcon slot="icon-only" icon={trashOutline} />
                          </IonButton>
                        </div>
                      </div>
                    </IonItem>
                  ))}
                </IonList>
              )}

              {!loading && !error && subcategories.length > 0 && (
                <div className="text-center mt-3">
                  <p>Total de subcategorias: {subcategories.length}</p>
                </div>
              )}
            </IonCardContent>
          </IonCard>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Confirmar exclusão"
          message={`Tem certeza que deseja excluir a subcategoria ${selectedSubcategory?.name}?`}
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
              handler: () => {
                setSelectedSubcategory(null);
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

export default SubcategoriesList;
