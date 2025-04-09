import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonInput,
  IonButton,
  IonSpinner,
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
import Header from "../../components/Header/Header";

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
    cpf: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    cpf: "",
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
        cpf: responsible.cpf || "",
      });
    }
  }, [responsible]);

  const validateInputs = () => {
    const newErrors: any = {};
    if (!responsibleInfo.name.trim()) newErrors.name = "Campo obrigatório.";

    if (responsibleInfo.email && !responsibleInfo.email.includes("@")) {
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
      dispatch(
        updateResponsible({ responsibleId, responsibleData: responsibleInfo })
      )
        .unwrap()
        .then(() => {
          setTimeout(() => {
            history.push("/responsibles");
          }, 2000);
        })
        .catch((error) => {
          console.error("Atualização falhou:", error);
        });
    }
  };

  return (
    <IonPage>
      <Header />
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
                      onClick={() => history.push("/responsibles")}
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
                      placeholder="CPF"
                      label="CPF"
                      labelPlacement="floating"
                      mode="md"
                      type="text"
                      value={responsibleInfo.cpf}
                      onIonInput={(e) => {
                        setResponsibleInfo({
                          ...responsibleInfo,
                          cpf: String(e.target.value),
                        });
                        if (errors.cpf) setErrors({ ...errors, cpf: "" });
                      }}
                    />
                    {errors.cpf && (
                      <span className="text-danger">{errors.cpf}</span>
                    )}
                  </div>

                  <div className="col-12 d-flex justify-content-between">
                    <IonButton
                      color="medium"
                      onClick={() => history.push("/responsibles")}
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
