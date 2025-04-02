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
    IonTextarea,
  } from "@ionic/react";
  import { useState } from "react";
  import { useAppDispatch, useAppSelector } from "../../store/hooks";
  import {
    createNotification,
    clearError,
    clearSuccessMessage,
  } from "../../store/slices/notification/createNotificationSlice";
  import { useFormCleanup } from "../../hooks/useFormCleanup";
  
  const CreateNotification: React.FC = () => {
    const [notificationInfos, setNotificationInfos] = useState({
      description: "",
    });
  
    const [errors, setErrors] = useState({
      description: "",
    });
  
    const dispatch = useAppDispatch();
    const { isAuthenticated, user, token } = useAppSelector(
      (state) => state.auth
    );
    const { loading, error, successMessage } = useAppSelector(
      (state) => state.createNotification
    );
  
    useFormCleanup({
      dispatch,
      clearError,
      clearSuccessMessage,
      resetFormState: () => {
        setNotificationInfos({
          description: "",
        });
      },
      resetFormErrors: () => {
        setErrors({
          description: "",
        });
      },
    });
  
    const validateInputs = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newErrors: any = {};
      if (!notificationInfos.description.trim()) newErrors.description = "Campo obrigatório.";
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
  
    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
      dispatch(clearError());
      dispatch(clearSuccessMessage());
  
      if (validateInputs()) {
        if (user?.id && user.email && user.roles) {
          const payload = {
            message: notificationInfos.description,
          };
          dispatch(createNotification(payload))
            .unwrap()
            .then(() => {
              setNotificationInfos({
                description: "",
              });
            })
            .catch((error) => {
              console.error("Notification creation failed:", error);
            });
        }
      }
    };
  
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Sistema Hospitalar</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div className="m-2 row justify-content-center align-items-center mt-6">
            <IonCard style={{ width: "90%", maxWidth: "45rem" }}>
              <h1 className="text-center text-uppercase fw-bold">
                Cadastro de Notificação
              </h1>
              <IonCardContent>
                <form
                  onSubmit={handleRegister}
                  className="row justify-content-center align-items-center gap-3 p-2"
                >
                  <div className="col-12">
                    <IonTextarea
                      color={"dark"}
                      fill="outline"
                      placeholder="Descrição da Notificação"
                      label="Descrição da Notificação"
                      labelPlacement="floating"
                      rows={4}
                      mode="md"
                      value={notificationInfos.description}
                      onIonInput={(e) => {
                        setNotificationInfos({
                          ...notificationInfos,
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
  
                  <div className="col-12">
                    <IonButton
                      expand="block"
                      color="primary"
                      className="custom-button"
                      onClick={handleRegister}
                      disabled={loading}
                    >
                      {loading ? <IonSpinner name="crescent" /> : "Cadastrar"}
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
              </IonCardContent>
            </IonCard>
          </div>
        </IonContent>
      </IonPage>
    );
  };
  
  export default CreateNotification;