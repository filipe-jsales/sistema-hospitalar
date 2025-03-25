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
  clearHospitalData,
  fetchHospitalById,
  updateHospital,
} from "../../store/slices/hospital/fetchHospitalByIdSlice";
import { clearHospitalError } from "../../store/slices/hospital/fetchHospitalsSlice";
import { clearSuccessMessage } from "../../store/slices/activationSlice";

interface HospitalParams {
  id: string;
}

const EditHospital: React.FC = () => {
  const { id } = useParams<HospitalParams>();
  const hospitalId = parseInt(id, 10);
  const history = useHistory();
  const dispatch = useAppDispatch();

  const { hospital, loading, error, successMessage } = useAppSelector(
    (state) => state.hospitalDetails
  );

  const [hospitalInfo, setHospitalInfo] = useState({
    name: "",
  });

  const [errors, setErrors] = useState({
    name: "",
  });

  useEffect(() => {
    dispatch(fetchHospitalById(hospitalId))
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar hospital:", error);
      });

    return () => {
      dispatch(clearHospitalError());
      dispatch(clearSuccessMessage());
      dispatch(clearHospitalData());
    };
  }, [dispatch, hospitalId]);

  useEffect(() => {
    if (hospital) {
      setHospitalInfo({
        name: hospital.name || "",
      });
    }
  }, [hospital]);

  const validateInputs = () => {
    const newErrors: any = {};
    if (!hospitalInfo.name.trim()) newErrors.name = "Campo obrigatório.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearHospitalError());
    dispatch(clearSuccessMessage());

    if (validateInputs()) {
      dispatch(updateHospital({ hospitalId, hospitalData: hospitalInfo }))
        .unwrap()
        .then(() => {
          setTimeout(() => {
            history.push("/hospitals");
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
            <IonBackButton defaultHref="/hospitals" />
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Sistema Hospitalar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="m-2 row justify-content-center align-items-center mt-6">
          <IonCard style={{ width: "90%", maxWidth: "45rem" }}>
            <h1 className="text-center text-uppercase fw-bold">
              Editar Hospital
            </h1>
            <IonCardContent>
              {loading && !hospital ? (
                <div className="text-center p-3">
                  <IonSpinner name="crescent" />
                  <p>Carregando dados do hospital...</p>
                </div>
              ) : error && !hospital ? (
                <div className="alert alert-danger col-12 text-center">
                  {error}
                  <div className="mt-3">
                    <IonButton
                      fill="solid"
                      color="primary"
                      onClick={() => history.push("/hospitals")}
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
                      placeholder="Nome do Hospital"
                      label="Nome"
                      labelPlacement="floating"
                      mode="md"
                      value={hospitalInfo.name}
                      onIonInput={(e) => {
                        setHospitalInfo({
                          ...hospitalInfo,
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
                      onClick={() => history.push("/hospitals")}
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

export default EditHospital;
