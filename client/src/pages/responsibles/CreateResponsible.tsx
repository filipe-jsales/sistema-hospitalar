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
  createResponsible,
  clearError,
  clearSuccessMessage,
} from "../../store/slices/responsible/createResponsibleSlice";
import { useFormCleanup } from "../../hooks/useFormCleanup";
import Header from "../../components/Header/Header";

const CreateResponsible: React.FC = () => {
  const [responsibleInfos, setResponsibleInfos] = useState({
    name: "",
    cpf: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    cpf: "",
    email: "",
  });

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { loading, error, successMessage } = useAppSelector(
    (state) => state.createResponsible
  );

  useFormCleanup({
    dispatch,
    clearError,
    clearSuccessMessage,
    resetFormState: () => {
      setResponsibleInfos({
        name: "",
        cpf: "",
        email: "",
      });
    },
    resetFormErrors: () => {
      setErrors({
        name: "",
        cpf: "",
        email: "",
      });
    },
  });

  const validateInputs = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newErrors: any = {};
    if (!responsibleInfos.name.trim()) newErrors.name = "Campo obrigatório.";
    if (!responsibleInfos.cpf.trim()) newErrors.cpf = "Campo obrigatório.";
    if (!responsibleInfos.email.trim()) newErrors.email = "Campo obrigatório.";
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
          name: responsibleInfos.name,
          cpf: responsibleInfos.cpf,
          email: responsibleInfos.email,
        };
        dispatch(createResponsible(payload))
          .unwrap()
          .then(() => {
            setResponsibleInfos({
              name: "",
              cpf: "",
              email: "",
            });
          })
          .catch((error) => {
            console.error("Responsible creation failed:", error);
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
              Cadastro de Responsáveis
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
                    placeholder="Nome do Responsável"
                    label="Nome do Responsável"
                    labelPlacement="floating"
                    mode="md"
                    value={responsibleInfos.name}
                    onIonInput={(e) => {
                      setResponsibleInfos({
                        ...responsibleInfos,
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
                    placeholder="CPF do Responsável"
                    label="CPF do Responsável"
                    labelPlacement="floating"
                    mode="md"
                    value={responsibleInfos.cpf}
                    onIonInput={(e) => {
                      setResponsibleInfos({
                        ...responsibleInfos,
                        cpf: String(e.target.value),
                      });
                      if (errors.cpf) setErrors({ ...errors, cpf: "" });
                    }}
                  />
                  {errors.cpf && (
                    <span className="text-danger">{errors.cpf}</span>
                  )}
                </div>

                <div className="col-12">
                  <IonInput
                    color={"dark"}
                    fill="outline"
                    placeholder="Email do Responsável"
                    label="Email do Responsável"
                    labelPlacement="floating"
                    mode="md"
                    value={responsibleInfos.email}
                    onIonInput={(e) => {
                      setResponsibleInfos({
                        ...responsibleInfos,
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

export default CreateResponsible;
