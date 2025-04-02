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
  clearIncidentData,
  clearSuccessMessage,
  fetchIncidentById,
  updateIncident,
} from "../../store/slices/incident/fetchIncidentByIdSlice";
import Header from "../../components/Header/Header";
import { clearIncidentError } from "../../store/slices/incident/fetchIncidentsSlice";

interface IncidentParams {
  id: string;
}

const EditIncident: React.FC = () => {
  const { id } = useParams<IncidentParams>();
  const incidentId = parseInt(id, 10);
  const history = useHistory();
  const dispatch = useAppDispatch();

  const { incident, loading, error, successMessage } = useAppSelector(
    (state) => state.incidentDetails
  );

  const [incidentInfo, setIncidentInfo] = useState({
    name: "",
    description: "",
    treatmentStartDate: 0,
    conclusionDate: 0,
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    treatmentStartDate: "",
    conclusionDate: "",
  });

  useEffect(() => {
    dispatch(fetchIncidentById(incidentId))
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar incidente:", error);
      });

    return () => {
      dispatch(clearIncidentError());
      dispatch(clearSuccessMessage());
      dispatch(clearIncidentData());
    };
  }, [dispatch, incidentId]);

  useEffect(() => {
    if (incident) {
      setIncidentInfo({
        name: incident.name || "",
        description: incident.description || "",
        treatmentStartDate: incident.treatmentStartDate,
        conclusionDate: incident.conclusionDate,
      });
    }
  }, [incident]);

  const validateInputs = () => {
    const newErrors: any = {};
    if (!incidentInfo.name.trim()) newErrors.name = "Campo obrigatório.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearIncidentError());
    dispatch(clearSuccessMessage());

    if (validateInputs()) {
      dispatch(updateIncident({ incidentId, incidentData: incidentInfo }))
        .unwrap()
        .then(() => {
          setTimeout(() => {
            history.push("/incidents");
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
              Editar Incidente
            </h1>
            <IonCardContent>
              {loading && !incident ? (
                <div className="text-center p-3">
                  <IonSpinner name="crescent" />
                  <p>Carregando dados do incidente...</p>
                </div>
              ) : error && !incident ? (
                <div className="alert alert-danger col-12 text-center">
                  {error}
                  <div className="mt-3">
                    <IonButton
                      fill="solid"
                      color="primary"
                      onClick={() => history.push("/incidents")}
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
                      placeholder="Nome do Incidente"
                      label="Nome"
                      labelPlacement="floating"
                      mode="md"
                      value={incidentInfo.name}
                      onIonInput={(e) => {
                        setIncidentInfo({
                          ...incidentInfo,
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
                      placeholder="Descrição do Incidente"
                      label="Descrição"
                      labelPlacement="floating"
                      mode="md"
                      value={incidentInfo.description}
                      onIonInput={(e) => {
                        setIncidentInfo({
                          ...incidentInfo,
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
                      fill="outline"
                      placeholder="Início da Tratativa"
                      label="Início da Tratativa"
                      labelPlacement="floating"
                      mode="md"
                      value={incidentInfo.treatmentStartDate}
                      onIonInput={(e) => {
                        setIncidentInfo({
                          ...incidentInfo,
                          treatmentStartDate: Number(e.target.value),
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
                      fill="outline"
                      placeholder="Data de Conclusão"
                      label="Data de Conclusão"
                      labelPlacement="floating"
                      mode="md"
                      value={incidentInfo.conclusionDate}
                      onIonInput={(e) => {
                        setIncidentInfo({
                          ...incidentInfo,
                          conclusionDate: Number(e.target.value),
                        });
                        if (errors.conclusionDate)
                          setErrors({ ...errors, conclusionDate: "" });
                      }}
                    />
                    {errors.conclusionDate && (
                      <span className="text-danger">
                        {errors.conclusionDate}
                      </span>
                    )}
                  </div>

                  <div className="col-12 d-flex justify-content-between">
                    <IonButton
                      color="medium"
                      onClick={() => history.push("/incidents")}
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

export default EditIncident;
