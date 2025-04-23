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
import { createOutline, trashOutline, pricetag } from "ionicons/icons";
import { useHistory } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  clearCategoryError,
  clearCategories,
  fetchCategories,
  CategoryData,
} from "../../store/slices/category/fetchCategoriesSlice";
import {
  deleteCategory,
  resetDeleteStatus,
} from "../../store/slices/category/deleteCategorySlice";
import Header from "../../components/Header/Header";

const CategoriesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { categories, loading, error } = useAppSelector(
    (state) => state.categories
  );

  const {
    loading: deleteLoading,
    error: deleteError,
    success: deleteSuccess,
  } = useAppSelector((state) => state.deleteCategory);

  const [searchText, setSearchText] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(
    null
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    loadCategories();

    return () => {
      dispatch(clearCategories());
      dispatch(clearCategoryError());
      dispatch(resetDeleteStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      setToastMessage("Categoria excluída com sucesso!");
      setShowToast(true);
      loadCategories();
      dispatch(resetDeleteStatus());
    }

    if (deleteError) {
      setToastMessage(deleteError);
      setShowToast(true);
    }
  }, [deleteSuccess, deleteError, dispatch]);

  const loadCategories = () => {
    dispatch(fetchCategories({ page: 1 }))
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar categorias:", error);
      });
  };

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    dispatch(fetchCategories({ page: 1 }))
      .unwrap()
      .finally(() => {
        event.detail.complete();
      });
  };

  const handleEdit = (category: CategoryData) => {
    history.push(`/categories/edit/${category.id}`);
  };

  const handleDelete = (category: CategoryData) => {
    setSelectedCategory(category);
    setShowAlert(true);
  };

  const confirmDelete = () => {
    if (selectedCategory) {
      dispatch(deleteCategory(selectedCategory.id));
      setShowAlert(false);
      setSelectedCategory(null);
    }
  };

  const filteredCategories = categories.filter((category) => {
    const name = category.name.toLowerCase();
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
              Listagem de Categorias
            </h1>

            <IonCardContent>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <IonSearchbar
                  value={searchText}
                  onIonInput={(e) => setSearchText(e.detail.value || "")}
                  placeholder="Buscar categorias"
                />

                <IonButton
                  color="primary"
                  routerLink="/categories/create"
                  className="ms-2"
                >
                  Nova Categoria
                </IonButton>
              </div>

              {loading ? (
                <div className="text-center p-3">
                  <IonSpinner name="crescent" />
                  <p>Carregando categorias...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger col-12 text-center">
                  {error}
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="alert alert-info col-12 text-center">
                  {searchText
                    ? "Nenhuma categoria encontrada com esta busca."
                    : "Nenhuma categoria cadastrada."}
                </div>
              ) : (
                <IonList>
                  {filteredCategories.map((category: CategoryData) => (
                    <IonItem key={category.id} className="mb-2">
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <div>
                          <IonLabel>
                            <h2>{category.name}</h2>
                            <p>ID: {category.id}</p>
                          </IonLabel>
                        </div>

                        <div className="d-flex align-items-center">
                          <IonChip color="primary">
                            <IonIcon icon={pricetag} />
                            <IonLabel>Categoria</IonLabel>
                          </IonChip>

                          <IonButton
                            fill="clear"
                            color="primary"
                            onClick={() => handleEdit(category)}
                          >
                            <IonIcon slot="icon-only" icon={createOutline} />
                          </IonButton>

                          <IonButton
                            fill="clear"
                            color="danger"
                            onClick={() => handleDelete(category)}
                          >
                            <IonIcon slot="icon-only" icon={trashOutline} />
                          </IonButton>
                        </div>
                      </div>
                    </IonItem>
                  ))}
                </IonList>
              )}

              {!loading && !error && categories.length > 0 && (
                <div className="text-center mt-3">
                  <p>Total de categorias: {categories.length}</p>
                </div>
              )}
            </IonCardContent>
          </IonCard>
        </div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Confirmar exclusão"
          message={`Tem certeza que deseja excluir a categoria ${selectedCategory?.name}?`}
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
              handler: () => {
                setSelectedCategory(null);
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

export default CategoriesList;
