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
  clearNotificationData,
  clearSuccessMessage,
  fetchNotificationById,
  updateNotification,
} from "../../store/slices/notification/fetchNotificationByIdSlice";
import { clearNotificationError } from "../../store/slices/notification/fetchNotificationsSlice";

interface NotificationParams {
  id: string;
}

const EditNotification: React.FC = () => {
  const { id } = useParams<NotificationParams>();
  const notificationId = parseInt(id, 10);
  const history = useHistory();
  const dispatch = useAppDispatch();

  const { notification, loading, error, successMessage } = useAppSelector(
    (state) => state.notificationDetails
  );

  const [notificationInfo, setNotificationInfo] = useState({
    description: "",
  });

  const [errors, setErrors] = useState({
    description: "",
  });

  useEffect(() => {
    dispatch(fetchNotificationById(notificationId))
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar notificação:", error);
      });

    return () => {
      dispatch(clearNotificationError());
      dispatch(clearSuccessMessage());
      dispatch(clearNotificationData());
    };
  }, [dispatch, notificationId]);

  useEffect(() => {
    if (notification) {
      setNotificationInfo({
        description: notification.description || "",
      });
    }
  }, [notification]);

  const validateInputs = () => {
    const newErrors: any = {};
    if (!notificationInfo.description.trim())
      newErrors.title = "Campo obrigatório.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearNotificationError());
    dispatch(clearSuccessMessage());

    if (validateInputs()) {
      dispatch(
        updateNotification({
          notificationId,
          notificationData: notificationInfo,
        })
      )
        .unwrap()
        .then(() => {
          setTimeout(() => {
            history.push("/notifications");
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
            <IonBackButton defaultHref="/notifications" />
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Sistema de Notificações</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="m-2 row justify-content-center align-items-center mt-6">
          <IonCard style={{ width: "90%", maxWidth: "45rem" }}>
            <h1 className="text-center text-uppercase fw-bold">
              Editar Notificação
            </h1>
            <IonCardContent>
              {loading && !notification ? (
                <div className="text-center p-3">
                  <IonSpinner name="crescent" />
                  <p>Carregando dados da notificação...</p>
                </div>
              ) : error && !notification ? (
                <div className="alert alert-danger col-12 text-center">
                  {error}
                  <div className="mt-3">
                    <IonButton
                      fill="solid"
                      color="primary"
                      onClick={() => history.push("/notifications")}
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
                      placeholder="Título da Notificação"
                      label="Título"
                      labelPlacement="floating"
                      mode="md"
                      value={notificationInfo.description}
                      onIonInput={(e) => {
                        setNotificationInfo({
                          ...notificationInfo,
                          description: String(e.target.value),
                        });
                        if (errors.description)
                          setErrors({ ...errors, description: "" });
                      }}
                    />
                    {errors.description && (
                      <span className="text-danger">{errors.description}</span>
                    )}
                  </div>

                  <div className="col-12 d-flex justify-content-between">
                    <IonButton
                      color="medium"
                      onClick={() => history.push("/notifications")}
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

export default EditNotification;
