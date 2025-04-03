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
  clearNotifyingServiceData,
  clearSuccessMessage,
  fetchNotifyingServiceById,
  updateNotifyingService,
} from "../../store/slices/notifyingService/fetchNotifyingServiceByIdSlice";
import { clearNotifyingServiceError } from "../../store/slices/notifyingService/fetchNotifyingServicesSlice";
import Header from "../../components/Header/Header";

interface NotifyingServiceParams {
  id: string;
}

const EditNotifyingService: React.FC = () => {
  const { id } = useParams<NotifyingServiceParams>();
  const notifyingServiceId = parseInt(id, 10);
  const history = useHistory();
  const dispatch = useAppDispatch();

  const { notifyingService, loading, error, successMessage } = useAppSelector(
    (state) => state.notifyingServiceDetails
  );

  const [notifyingServiceInfo, setNotifyingServiceInfo] = useState({
    name: "",
  });

  const [errors, setErrors] = useState({
    name: "",
  });

  useEffect(() => {
    dispatch(fetchNotifyingServiceById(notifyingServiceId))
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar serviço de notificação:", error);
      });

    return () => {
      dispatch(clearNotifyingServiceError());
      dispatch(clearSuccessMessage());
      dispatch(clearNotifyingServiceData());
    };
  }, [dispatch, notifyingServiceId]);

  useEffect(() => {
    if (notifyingService) {
      setNotifyingServiceInfo({
        name: notifyingService.name || "",
      });
    }
  }, [notifyingService]);

  const validateInputs = () => {
    const newErrors: any = {};
    if (!notifyingServiceInfo.name.trim())
      newErrors.name = "Campo obrigatório.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearNotifyingServiceError());
    dispatch(clearSuccessMessage());

    if (validateInputs()) {
      dispatch(
        updateNotifyingService({
          notifyingServiceId,
          notifyingServiceData: notifyingServiceInfo,
        })
      )
        .unwrap()
        .then(() => {
          setTimeout(() => {
            history.push("/notifying-services");
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
              Editar Serviço de Notificação
            </h1>
            <IonCardContent>
              {loading && !notifyingService ? (
                <div className="text-center p-3">
                  <IonSpinner name="crescent" />
                  <p>Carregando dados do serviço de notificação...</p>
                </div>
              ) : error && !notifyingService ? (
                <div className="alert alert-danger col-12 text-center">
                  {error}
                  <div className="mt-3">
                    <IonButton
                      fill="solid"
                      color="primary"
                      onClick={() => history.push("/notifying-services")}
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
                      placeholder="Nome do Serviço de Notificação"
                      label="Nome"
                      labelPlacement="floating"
                      mode="md"
                      value={notifyingServiceInfo.name}
                      onIonInput={(e) => {
                        setNotifyingServiceInfo({
                          ...notifyingServiceInfo,
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
                      onClick={() => history.push("/notifying-services")}
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

export default EditNotifyingService;
