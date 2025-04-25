import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonInput,
  IonButton,
  IonSpinner,
} from "@ionic/react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  createNotifyingService,
  clearError,
  clearSuccessMessage,
} from "../../store/slices/notifyingService/createNotifyingServiceSlice";
import { useFormCleanup } from "../../hooks/useFormCleanup";
import Header from "../../components/Header/Header";

const CreateNotifyingService: React.FC = () => {
  const [notifyingServiceInfos, setNotifyingServiceInfos] = useState({
    name: "",
  });

  const [errors, setErrors] = useState({
    name: "",
  });

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { loading, error, successMessage } = useAppSelector(
    (state) => state.createNotifyingService
  );

  useFormCleanup({
    dispatch,
    clearError,
    clearSuccessMessage,
    resetFormState: () => {
      setNotifyingServiceInfos({
        name: "",
      });
    },
    resetFormErrors: () => {
      setErrors({
        name: "",
      });
    },
  });

  const validateInputs = () => {
    const newErrors: any = {};
    if (!notifyingServiceInfos.name.trim())
      newErrors.name = "Campo obrigatório.";
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
          name: notifyingServiceInfos.name,
        };
        dispatch(createNotifyingService(payload))
          .unwrap()
          .then(() => {
            setNotifyingServiceInfos({
              name: "",
            });
          })
          .catch((error) => {
            console.error("Notifying Service creation failed:", error);
          });
      }
    }
  };

  return (
    <IonPage>
      <Header />
      <IonContent>
        <div className="m-2 row justify-content-center align-items-center mt-6">
          <IonCard style={{ width: "90%", maxWidth: "45rem" }}>
            <h1 className="text-center text-uppercase fw-bold">
              Cadastro de Serviços de Notificação
            </h1>
            <IonCardContent>
              <form
                onSubmit={handleRegister}
                className="row justify-content-center align-items-center gap-3 p-2"
              >
                <div className="col-12">
                  <IonInput
                    color={"dark"}
                    fill="outline"
                    placeholder="Nome do Serviço"
                    label="Nome do Serviço"
                    labelPlacement="floating"
                    mode="md"
                    value={notifyingServiceInfos.name}
                    onIonInput={(e) => {
                      setNotifyingServiceInfos({
                        ...notifyingServiceInfos,
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

export default CreateNotifyingService;
