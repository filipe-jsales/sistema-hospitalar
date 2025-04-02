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
    clearResponsibleData,
    clearSuccessMessage,
    fetchResponsibleById,
    updateResponsible,
  } from "../../store/slices/responsible/fetchResponsibleByIdSlice";
  import { clearResponsibleError } from "../../store/slices/responsible/fetchResponsiblesSlice";
  
  interface ResponsibleParams {
    id: string;
  }
  
  const EditResponsible: React.FC = () => {
    const { id } = useParams<ResponsibleParams>();
    const responsibleId = parseInt(id, 10);
    const history = useHistory();
    const dispatch = useAppDispatch();
  
    const { responsible, loading, error, successMessage } = useAppSelector(
      (state) => state.responsibleDetails
    );
  
    const [responsibleInfo, setResponsibleInfo] = useState({
      name: "",
      email: "",
      phone: "",
      department: "",
    });
  
    const [errors, setErrors] = useState({
      name: "",
      email: "",
      phone: "",
      department: "",
    });
  
    useEffect(() => {
      dispatch(fetchResponsibleById(responsibleId))
        .unwrap()
        .catch((error) => {
          console.error("Falha ao carregar responsável:", error);
        });
  
      return () => {
        dispatch(clearResponsibleError());
        dispatch(clearSuccessMessage());
        dispatch(clearResponsibleData());
      };
    }, [dispatch, responsibleId]);
  
    useEffect(() => {
      if (responsible) {
        setResponsibleInfo({
          name: responsible.name || "",
          email: responsible.email || "",
          phone: responsible.phone || "",
          department: responsible.department || "",
        });
      }
    }, [responsible]);
  
    const validateInputs = () => {
      const newErrors: any = {};
      if (!responsibleInfo.name.trim()) newErrors.name = "Campo obrigatório.";
      
      // Validação de email (opcional)
      if (responsibleInfo.email && !responsibleInfo.email.includes('@')) {
        newErrors.email = "Email inválido.";
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleUpdate = async (e: React.FormEvent) => {
      e.preventDefault();
      dispatch(clearResponsibleError());
      dispatch(clearSuccessMessage());
  
      if (validateInputs()) {
        dispatch(updateResponsible({ responsibleId, responsibleData: responsibleInfo }))
          .unwrap()
          .then(() => {
            setTimeout(() => {
              history.push("/responsible");
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
              <IonBackButton defaultHref="/responsible" />
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Sistema de Responsáveis</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="m-2 row justify-content-center align-items-center mt-6">
            <IonCard style={{ width: "90%", maxWidth: "45rem" }}>
              <h1 className="text-center text-uppercase fw-bold">
                Editar Responsável
              </h1>
              <IonCardContent>
                {loading && !responsible ? (
                  <div className="text-center p-3">
                    <IonSpinner name="crescent" />
                    <p>Carregando dados do responsável...</p>
                  </div>
                ) : error && !responsible ? (
                  <div className="alert alert-danger col-12 text-center">
                    {error}
                    <div className="mt-3">
                      <IonButton
                        fill="solid"
                        color="primary"
                        onClick={() => history.push("/responsible")}
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
                        placeholder="Nome do Responsável"
                        label="Nome"
                        labelPlacement="floating"
                        mode="md"
                        value={responsibleInfo.name}
                        onIonInput={(e) => {
                          setResponsibleInfo({
                            ...responsibleInfo,
                            name: String(e.target.value),
                          });
                          if (errors.name) setErrors({ ...errors, name: "" });
                        }}
                      />
                      {errors.name && (
                        <span className="text-danger">{errors.name}</span>
                      )}
                    </div>
  
                    <div className="col-12">
                      <IonInput
                        color={"dark"}
                        fill="outline"
                        placeholder="Email do Responsável"
                        label="Email"
                        labelPlacement="floating"
                        mode="md"
                        type="email"
                        value={responsibleInfo.email}
                        onIonInput={(e) => {
                          setResponsibleInfo({
                            ...responsibleInfo,
                            email: String(e.target.value),
                          });
                          if (errors.email) setErrors({ ...errors, email: "" });
                        }}
                      />
                      {errors.email && (
                        <span className="text-danger">{errors.email}</span>
                      )}
                    </div>
  
                    <div className="col-12">
                      <IonInput
                        color={"dark"}
                        fill="outline"
                        placeholder="Telefone do Responsável"
                        label="Telefone"
                        labelPlacement="floating"
                        mode="md"
                        value={responsibleInfo.phone}
                        onIonInput={(e) => {
                          setResponsibleInfo({
                            ...responsibleInfo,
                            phone: String(e.target.value),
                          });
                          if (errors.phone) setErrors({ ...errors, phone: "" });
                        }}
                      />
                      {errors.phone && (
                        <span className="text-danger">{errors.phone}</span>
                      )}
                    </div>
  
                    <div className="col-12">
                      <IonInput
                        color={"dark"}
                        fill="outline"
                        placeholder="Departamento do Responsável"
                        label="Departamento"
                        labelPlacement="floating"
                        mode="md"
                        value={responsibleInfo.department}
                        onIonInput={(e) => {
                          setResponsibleInfo({
                            ...responsibleInfo,
                            department: String(e.target.value),
                          });
                          if (errors.department) setErrors({ ...errors, department: "" });
                        }}
                      />
                      {errors.department && (
                        <span className="text-danger">{errors.department}</span>
                      )}
                    </div>
  
                    <div className="col-12 d-flex justify-content-between">
                      <IonButton
                        color="medium"
                        onClick={() => history.push("/responsible")}
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
  
  export default EditResponsible;