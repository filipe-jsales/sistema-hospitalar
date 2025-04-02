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
  clearPriorityData,
  clearSuccessMessage,
  fetchPriorityById,
  updatePriority,
} from "../../store/slices/priority/fetchPriorityByIdSlice";
import { clearPriorityError } from "../../store/slices/priority/fetchPrioritiesSlice";

interface PriorityParams {
  id: string;
}

const EditPriority: React.FC = () => {
  const { id } = useParams<PriorityParams>();
  const priorityId = parseInt(id, 10);
  const history = useHistory();
  const dispatch = useAppDispatch();

  const { priority, loading, error, successMessage } = useAppSelector(
    (state) => state.priorityDetails
  );

  const [priorityInfo, setPriorityInfo] = useState({
    name: "",
  });

  const [errors, setErrors] = useState({
    name: "",
  });

  useEffect(() => {
    dispatch(fetchPriorityById(priorityId))
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar prioridade:", error);
      });

    return () => {
      dispatch(clearPriorityError());
      dispatch(clearSuccessMessage());
      dispatch(clearPriorityData());
    };
  }, [dispatch, priorityId]);

  useEffect(() => {
    if (priority) {
      setPriorityInfo({
        name: priority.name || "",
      });
    }
  }, [priority]);

  const validateInputs = () => {
    const newErrors: any = {};
    if (!priorityInfo.name.trim()) newErrors.name = "Campo obrigatório.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearPriorityError());
    dispatch(clearSuccessMessage());

    if (validateInputs()) {
      dispatch(updatePriority({ priorityId, priorityData: priorityInfo }))
        .unwrap()
        .then(() => {
          setTimeout(() => {
            history.push("/priorities");
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
            <IonBackButton defaultHref="/priorities" />
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Sistema de Prioridades</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="m-2 row justify-content-center align-items-center mt-6">
          <IonCard style={{ width: "90%", maxWidth: "45rem" }}>
            <h1 className="text-center text-uppercase fw-bold">
              Editar Prioridade
            </h1>
            <IonCardContent>
              {loading && !priority ? (
                <div className="text-center p-3">
                  <IonSpinner name="crescent" />
                  <p>Carregando dados da prioridade...</p>
                </div>
              ) : error && !priority ? (
                <div className="alert alert-danger col-12 text-center">
                  {error}
                  <div className="mt-3">
                    <IonButton
                      fill="solid"
                      color="primary"
                      onClick={() => history.push("/priorities")}
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
                      placeholder="Nome da Prioridade"
                      label="Nome"
                      labelPlacement="floating"
                      mode="md"
                      value={priorityInfo.name}
                      onIonInput={(e) => {
                        setPriorityInfo({
                          ...priorityInfo,
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
                      onClick={() => history.push("/priorities")}
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

export default EditPriority;
