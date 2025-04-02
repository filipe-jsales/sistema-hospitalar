import {
    IonContent,
    IonPage,
    IonCard,
    IonCardContent,
    IonInput,
    IonButton,
    IonSpinner,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonTitle,
    IonBackButton,
  } from "@ionic/react";
  import { useState, useEffect } from "react";
  import { useParams, useHistory } from "react-router-dom";
  import { useAppDispatch, useAppSelector } from "../../store/hooks";
  import {
    clearThemeData,
    clearSuccessMessage,
    fetchThemeById,
    updateTheme,
  } from "../../store/slices/theme/fetchThemeByIdSlice";
  import { clearThemeError } from "../../store/slices/theme/fetchThemesSlice";
  
  interface ThemeParams {
    id: string;
  }
  
  const EditTheme: React.FC = () => {
    const { id } = useParams<ThemeParams>();
    const themeId = parseInt(id, 10);
    const history = useHistory();
    const dispatch = useAppDispatch();
  
    const { theme, loading, error, successMessage } = useAppSelector(
      (state) => state.themeDetails
    );
  
    const [themeInfo, setThemeInfo] = useState({
      name: "",
    });
  
    const [errors, setErrors] = useState({
      name: "",
    });
  
    useEffect(() => {
      dispatch(fetchThemeById(themeId))
        .unwrap()
        .catch((error) => {
          console.error("Falha ao carregar tema:", error);
        });
  
      return () => {
        dispatch(clearThemeError());
        dispatch(clearSuccessMessage());
        dispatch(clearThemeData());
      };
    }, [dispatch, themeId]);
  
    useEffect(() => {
      if (theme) {
        setThemeInfo({
          name: theme.name || "",
        });
      }
    }, [theme]);
  
    const validateInputs = () => {
      const newErrors: any = {};
      if (!themeInfo.name.trim()) newErrors.name = "Campo obrigatório.";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      dispatch(clearThemeError());
      dispatch(clearSuccessMessage());
  
      if (validateInputs()) {
        dispatch(updateTheme({ 
          themeId, 
          themeData: themeInfo 
        }))
          .unwrap()
          .then(() => {
            setTimeout(() => {
              history.push("/themes");
            }, 2000);
          })
          .catch((error) => {
            console.error("Atualização falhou:", error);
          });
      }
    };
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/themes" />
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Sistema de Temas</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="m-2 row justify-content-center align-items-center mt-6">
            <IonCard style={{ width: "90%", maxWidth: "45rem" }}>
              <h1 className="text-center text-uppercase fw-bold">
                Editar Tema
              </h1>
              <IonCardContent>
                {loading && !theme ? (
                  <div className="text-center p-3">
                    <IonSpinner name="crescent" />
                    <p>Carregando dados do tema...</p>
                  </div>
                ) : error && !theme ? (
                  <div className="alert alert-danger col-12 text-center">
                    {error}
                    <div className="mt-3">
                      <IonButton
                        fill="solid"
                        color="primary"
                        onClick={() => history.push("/themes")}
                      >
                        Voltar para a listagem
                      </IonButton>
                    </div>
                  </div>
                ) : (
                  <form
                    onSubmit={handleUpdate}
                    className="row justify-content-center align-items-center gap-3 p-2"
                  >
                    <div className="col-12">
                      <IonInput
                        color={"dark"}
                        fill="outline"
                        placeholder="Nome do Tema"
                        label="Nome"
                        labelPlacement="floating"
                        mode="md"
                        value={themeInfo.name}
                        onIonInput={(e) => {
                          setThemeInfo({
                            ...themeInfo,
                            name: String(e.target.value),
                          });
                          if (errors.name) setErrors({ ...errors, name: "" });
                        }}
                      />
                      {errors.name && (
                        <span className="text-danger">{errors.name}</span>
                      )}
                    </div>
  
                    <div className="col-12 d-flex justify-content-between">
                      <IonButton
                        color="medium"
                        onClick={() => history.push("/themes")}
                      >
                        Cancelar
                      </IonButton>
                      <IonButton
                        expand="block"
                        color="primary"
                        className="custom-button"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <IonSpinner name="crescent" />
                        ) : (
                          "Salvar Alterações"
                        )}
                      </IonButton>
                    </div>
  
                    {successMessage && (
                      <div className="alert alert-success col-12 text-center">
                        {successMessage}
                      </div>
                    )}
  
                    {error && (
                      <div className="alert alert-danger col-12 text-center">
                        {error}
                      </div>
                    )}
                  </form>
                )}
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default EditTheme;