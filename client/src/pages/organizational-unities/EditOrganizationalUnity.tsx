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
    clearOrganizationalUnityData,
    clearSuccessMessage,
    fetchOrganizationalUnityById,
    updateOrganizationalUnity,
  } from "../../store/slices/organizationalUnity/fetchOrganizationalUnityByIdSlice";
  import { clearOrganizationalUnityError } from "../../store/slices/organizationalUnity/fetchOrganizationalUnitiesSlice";
  
  interface OrganizationalUnityParams {
    id: string;
  }
  
  const EditOrganizationalUnity: React.FC = () => {
    const { id } = useParams<OrganizationalUnityParams>();
    const organizationalUnityId = parseInt(id, 10);
    const history = useHistory();
    const dispatch = useAppDispatch();
  
    const { organizationalUnity, loading, error, successMessage } = useAppSelector(
      (state) => state.organizationalUnityDetails
    );
  
    const [organizationalUnityInfo, setOrganizationalUnityInfo] = useState({
      name: "",
    });
  
    const [errors, setErrors] = useState({
      name: "",
    });
  
    useEffect(() => {
      dispatch(fetchOrganizationalUnityById(organizationalUnityId))
        .unwrap()
        .catch((error) => {
          console.error("Falha ao carregar unidade organizacional:", error);
        });
  
      return () => {
        dispatch(clearOrganizationalUnityError());
        dispatch(clearSuccessMessage());
        dispatch(clearOrganizationalUnityData());
      };
    }, [dispatch, organizationalUnityId]);
  
    useEffect(() => {
      if (organizationalUnity) {
        setOrganizationalUnityInfo({
          name: organizationalUnity.name || "",
        });
      }
    }, [organizationalUnity]);
  
    const validateInputs = () => {
      const newErrors: any = {};
      if (!organizationalUnityInfo.name.trim()) newErrors.name = "Campo obrigatório.";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      dispatch(clearOrganizationalUnityError());
      dispatch(clearSuccessMessage());
  
      if (validateInputs()) {
        dispatch(updateOrganizationalUnity({ 
          organizationalUnityId, 
          organizationalUnityData: organizationalUnityInfo 
        }))
          .unwrap()
          .then(() => {
            setTimeout(() => {
              history.push("/organizational-unities");
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
              <IonBackButton defaultHref="/organizational-unities" />
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Sistema de Unidades Organizacionais</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="m-2 row justify-content-center align-items-center mt-6">
            <IonCard style={{ width: "90%", maxWidth: "45rem" }}>
              <h1 className="text-center text-uppercase fw-bold">
                Editar Unidade Organizacional
              </h1>
              <IonCardContent>
                {loading && !organizationalUnity ? (
                  <div className="text-center p-3">
                    <IonSpinner name="crescent" />
                    <p>Carregando dados da unidade organizacional...</p>
                  </div>
                ) : error && !organizationalUnity ? (
                  <div className="alert alert-danger col-12 text-center">
                    {error}
                    <div className="mt-3">
                      <IonButton
                        fill="solid"
                        color="primary"
                        onClick={() => history.push("/organizational-unities")}
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
                        placeholder="Nome da Unidade Organizacional"
                        label="Nome"
                        labelPlacement="floating"
                        mode="md"
                        value={organizationalUnityInfo.name}
                        onIonInput={(e) => {
                          setOrganizationalUnityInfo({
                            ...organizationalUnityInfo,
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
                        onClick={() => history.push("/organizational-unities")}
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
  
  export default EditOrganizationalUnity;