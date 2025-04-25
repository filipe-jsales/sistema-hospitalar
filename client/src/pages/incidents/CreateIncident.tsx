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
  createIncident,
  clearError,
  clearSuccessMessage,
} from "../../store/slices/incident/createIncidentSlice";
import { useFormCleanup } from "../../hooks/useFormCleanup";
import Header from "../../components/Header/Header";

const CreateIncident: React.FC = () => {
  const [incidentInfos, setIncidentInfos] = useState({
    name: "",
    description: "",
    treatmentStartDate: "",
    conclusionDate: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    treatmentStartDate: "",
    conclusionDate: "",
  });

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { loading, error, successMessage } = useAppSelector(
    (state) => state.createIncident
  );

  useFormCleanup({
    dispatch,
    clearError,
    clearSuccessMessage,
    resetFormState: () => {
      setIncidentInfos({
        name: "",
        description: "",
        treatmentStartDate: "",
        conclusionDate: "",
      });
    },
    resetFormErrors: () => {
      setErrors({
        name: "",
        description: "",
        treatmentStartDate: "",
        conclusionDate: "",
      });
    },
  });

  const validateInputs = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newErrors: any = {};
    if (!incidentInfos.name.trim()) newErrors.name = "Campo obrigatório.";
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
          name: incidentInfos.name,
          description: incidentInfos.description,
          treatmentStartDate: Number(incidentInfos.treatmentStartDate),
          conclusionDate: Number(incidentInfos.conclusionDate),
        };
        dispatch(createIncident(payload))
          .unwrap()
          .then(() => {
            setIncidentInfos({
              name: "",
              description: "",
              treatmentStartDate: "",
              conclusionDate: "",
            });
          })
          .catch((error) => {
            console.error("Incident creation failed:", error);
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
              Cadastro de Incidente
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
                    placeholder="Nome do Incidente"
                    label="Nome do Incidente"
                    labelPlacement="floating"
                    mode="md"
                    value={incidentInfos.name}
                    onIonInput={(e) => {
                      setIncidentInfos({
                        ...incidentInfos,
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
                    placeholder="Descrição"
                    label="Descrição"
                    labelPlacement="floating"
                    mode="md"
                    value={incidentInfos.description}
                    onIonInput={(e) => {
                      setIncidentInfos({
                        ...incidentInfos,
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
                  <IonInput
                    color={"dark"}
                    type="number"
                    min={0}
                    fill="outline"
                    placeholder="Início Tratativa"
                    label="Início Tratativa"
                    labelPlacement="floating"
                    mode="md"
                    value={incidentInfos.treatmentStartDate}
                    onIonInput={(e) => {
                      setIncidentInfos({
                        ...incidentInfos,
                        treatmentStartDate: String(e.target.value),
                      });
                      if (errors.treatmentStartDate)
                        setErrors({ ...errors, treatmentStartDate: "" });
                    }}
                  />
                  {errors.treatmentStartDate && (
                    <span className="text-danger">
                      {errors.treatmentStartDate}
                    </span>
                  )}
                </div>

                <div className="col-12">
                  <IonInput
                    color={"dark"}
                    type="number"
                    min={0}
                    fill="outline"
                    placeholder="Data de Conclusão"
                    label="Data de Conclusão"
                    labelPlacement="floating"
                    mode="md"
                    value={incidentInfos.conclusionDate}
                    onIonInput={(e) => {
                      setIncidentInfos({
                        ...incidentInfos,
                        conclusionDate: String(e.target.value),
                      });
                      if (errors.conclusionDate)
                        setErrors({ ...errors, conclusionDate: "" });
                    }}
                  />
                  {errors.conclusionDate && (
                    <span className="text-danger">{errors.conclusionDate}</span>
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

export default CreateIncident;
