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
import { createOutline, trashOutline, colorPalette } from "ionicons/icons";
import { useHistory } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  clearThemeError,
  clearThemes,
  fetchThemes,
  ThemeData,
} from "../../store/slices/theme/fetchThemesSlice";
import {
  deleteTheme,
  resetDeleteStatus,
} from "../../store/slices/theme/deleteThemeSlice";
import Header from "../../components/Header/Header";

const ThemesList: React.FC = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();
  const { themes, loading, error, pagination } = useAppSelector(
    (state) => state.themes
  );

  const { error: deleteError, success: deleteSuccess } = useAppSelector(
    (state) => state.deleteTheme
  );

  const [searchText, setSearchText] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeData | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadThemes(1);

    return () => {
      dispatch(clearThemes());
      dispatch(clearThemeError());
      dispatch(resetDeleteStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      setToastMessage("Tema excluído com sucesso!");
      setShowToast(true);
      loadThemes(currentPage);
      dispatch(resetDeleteStatus());
    }

    if (deleteError) {
      setToastMessage(deleteError);
      setShowToast(true);
    }
  }, [deleteSuccess, deleteError, dispatch, currentPage]);

  const loadThemes = (page: number) => {
    dispatch(fetchThemes({ page }))
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar temas:", error);
      });
  };

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    dispatch(fetchThemes({ page: currentPage }))
      .unwrap()
      .finally(() => {
        event.detail.complete();
      });
  };

  const handleEdit = (theme: ThemeData) => {
    history.push(`/themes/edit/${theme.id}`);
  };

  const handleDelete = (theme: ThemeData) => {
    setSelectedTheme(theme);
    setShowAlert(true);
  };

  const confirmDelete = () => {
    if (selectedTheme) {
      dispatch(deleteTheme(selectedTheme.id));
      setShowAlert(false);
      setSelectedTheme(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
      loadThemes(newPage);
    }
  };

  const filteredThemes = themes.filter((theme) => {
    const name = theme.name.toLowerCase();
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
              Listagem de Temas
            </h1>

            <IonCardContent>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <IonSearchbar
                  value={searchText}
                  onIonInput={(e) => setSearchText(e.detail.value || "")}
                  placeholder="Buscar temas"
                />

                <IonButton
                  color="primary"
                  routerLink="/themes/create"
                  className="ms-2"
                >
                  Novo Tema
                </IonButton>
              </div>

              {loading ? (
                <div className="text-center p-3">
                  <IonSpinner name="crescent" />
                  <p>Carregando temas...</p>
                </div>
              ) : error ? (
                <div className="alert alert-danger col-12 text-center">
                  {error}
                </div>
              ) : filteredThemes.length === 0 ? (
                <div className="alert alert-info col-12 text-center">
                  {searchText
                    ? "Nenhum tema encontrado com esta busca."
                    : "Nenhum tema cadastrado."}
                </div>
              ) : (
                <IonList>
                  {filteredThemes.map((theme: ThemeData) => (
                    <IonItem key={theme.id} className="mb-2">
                      <div className="d-flex w-100 justify-content-between align-items-center">
                        <div>
                          <IonLabel>
                            <h2>{theme.name}</h2>
                            <p>ID: {theme.id}</p>
                          </IonLabel>
                        </div>

                        <div className="d-flex align-items-center">
                          <IonChip color="primary">
                            <IonIcon icon={colorPalette} />
                            <IonLabel>Tema</IonLabel>
                          </IonChip>

                          <IonButton
                            fill="clear"
                            color="primary"
                            onClick={() => handleEdit(theme)}
                          >
                            <IonIcon slot="icon-only" icon={createOutline} />
                          </IonButton>

                          <IonButton
                            fill="clear"
                            color="danger"
                            onClick={() => handleDelete(theme)}
                          >
                            <IonIcon slot="icon-only" icon={trashOutline} />
                          </IonButton>
                        </div>
                      </div>
                    </IonItem>
                  ))}
                </IonList>
              )}

              {!loading && !error && pagination && (
                <div className="text-center mt-3">
                  <p>
                    Exibindo {themes.length} de {pagination.totalItems} temas
                    {searchText && " (filtrados)"}
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
          message={`Tem certeza que deseja excluir o tema ${selectedTheme?.name}?`}
          buttons={[
            {
              text: "Cancelar",
              role: "cancel",
              handler: () => {
                setSelectedTheme(null);
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

export default ThemesList;
