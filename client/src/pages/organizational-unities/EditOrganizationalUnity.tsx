import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonInput,
  IonButton,
  IonSpinner,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  clearOrganizationalUnityData,
  clearSuccessMessage,
  fetchOrganizationalUnityById,
  updateOrganizationalUnity,
} from "../../store/slices/organizationalUnity/fetchOrganizationalUnityByIdSlice";
import { clearOrganizationalUnityError } from "../../store/slices/organizationalUnity/fetchOrganizationalUnitiesSlice";
import Header from "../../components/Header/Header";
import { fetchResponsibles } from "../../store/slices/responsible/fetchResponsiblesSlice";

interface OrganizationalUnityParams {
  id: string;
}

const EditOrganizationalUnity: React.FC = () => {
  const { id } = useParams<OrganizationalUnityParams>();
  const organizationalUnityId = parseInt(id, 10);
  const history = useHistory();
  const dispatch = useAppDispatch();

  const { organizationalUnity, loading, error, successMessage } =
    useAppSelector((state) => state.organizationalUnityDetails);

  const {
    responsibles,
    loading: responsiblesLoading,
    error: responsiblesError,
  } = useAppSelector((state) => state.responsibles);
  useEffect(() => {
    dispatch(fetchResponsibles({ page: 1 }))
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar chefes:", error);
      });
  }, [dispatch]);

  const [organizationalUnityInfo, setOrganizationalUnityInfo] = useState({
    name: "",
    acronym: "",
    organizationalAcronym: "",
    organizationalUnitType: "",
    managementGroup: "",
    divisionalGrouping: "",
    sectorGrouping: "",
    managerId: null as number | null,
  });

  const [errors, setErrors] = useState({
    name: "",
    acronym: "",
    organizationalAcronym: "",
    organizationalUnitType: "",
    managementGroup: "",
    divisionalGrouping: "",
    sectorGrouping: "",
    managerId: "",
  });

  useEffect(() => {
    dispatch(fetchOrganizationalUnityById(organizationalUnityId))
      .unwrap()
      .catch((error) => {
        console.error("Falha ao carregar unidade organizacional:", error);
      });

    return () => {
      dispatch(clearOrganizationalUnityError());
      dispatch(clearSuccessMessage());
      dispatch(clearOrganizationalUnityData());
    };
  }, [dispatch, organizationalUnityId]);

  useEffect(() => {
    if (organizationalUnity) {
      setOrganizationalUnityInfo({
        name: organizationalUnity.name || "",
        acronym: "",
        organizationalAcronym: "",
        organizationalUnitType: "",
        managementGroup: "",
        divisionalGrouping: "",
        sectorGrouping: "",
        managerId: null,
      });
    }
  }, [organizationalUnity]);

  const validateInputs = () => {
    const newErrors: any = {};
    if (!organizationalUnityInfo.name.trim())
      newErrors.name = "Campo obrigatório.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearOrganizationalUnityError());
    dispatch(clearSuccessMessage());

    if (validateInputs()) {
      dispatch(
        updateOrganizationalUnity({
          organizationalUnityId,
          organizationalUnityData: organizationalUnityInfo,
        })
      )
        .unwrap()
        .then(() => {
          setTimeout(() => {
            history.push("/organizational-unities");
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
              Editar Unidade Organizacional
            </h1>
            <IonCardContent>
              {loading && !organizationalUnity ? (
                <div className="text-center p-3">
                  <IonSpinner name="crescent" />
                  <p>Carregando dados da unidade organizacional...</p>
                </div>
              ) : error && !organizationalUnity ? (
                <div className="alert alert-danger col-12 text-center">
                  {error}
                  <div className="mt-3">
                    <IonButton
                      fill="solid"
                      color="primary"
                      onClick={() => history.push("/organizational-unities")}
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
                      placeholder="Nome da Unidade Organizacional"
                      label="Nome"
                      labelPlacement="floating"
                      mode="md"
                      value={organizationalUnityInfo.name}
                      onIonInput={(e) => {
                        setOrganizationalUnityInfo({
                          ...organizationalUnityInfo,
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
                      placeholder="Sigla"
                      label="Sigla"
                      labelPlacement="floating"
                      mode="md"
                      value={organizationalUnityInfo.acronym}
                      onIonInput={(e) => {
                        setOrganizationalUnityInfo({
                          ...organizationalUnityInfo,
                          acronym: String(e.target.value),
                        });
                        if (errors.acronym)
                          setErrors({ ...errors, acronym: "" });
                      }}
                    />
                    {errors.acronym && (
                      <span className="text-danger">{errors.acronym}</span>
                    )}
                  </div>

                  <div className="col-12">
                    <IonInput
                      color={"dark"}
                      fill="outline"
                      placeholder="Sigla Organograma"
                      label="Sigla Organograma"
                      labelPlacement="floating"
                      mode="md"
                      value={organizationalUnityInfo.organizationalAcronym}
                      onIonInput={(e) => {
                        setOrganizationalUnityInfo({
                          ...organizationalUnityInfo,
                          organizationalAcronym: String(e.target.value),
                        });
                        if (errors.organizationalAcronym)
                          setErrors({ ...errors, organizationalAcronym: "" });
                      }}
                    />
                    {errors.organizationalAcronym && (
                      <span className="text-danger">
                        {errors.organizationalAcronym}
                      </span>
                    )}
                  </div>

                  <div className="col-12">
                    <IonInput
                      color={"dark"}
                      fill="outline"
                      placeholder="Tipo de Unidade Organizacional"
                      label="Tipo de Unidade Organizacional"
                      labelPlacement="floating"
                      mode="md"
                      value={organizationalUnityInfo.organizationalUnitType}
                      onIonInput={(e) => {
                        setOrganizationalUnityInfo({
                          ...organizationalUnityInfo,
                          organizationalUnitType: String(e.target.value),
                        });
                        if (errors.organizationalUnitType)
                          setErrors({ ...errors, organizationalUnitType: "" });
                      }}
                    />
                    {errors.organizationalUnitType && (
                      <span className="text-danger">
                        {errors.organizationalUnitType}
                      </span>
                    )}
                  </div>

                  <div className="col-12">
                    <IonInput
                      color={"dark"}
                      fill="outline"
                      placeholder="Agrupamento Gerência"
                      label="Agrupamento Gerência"
                      labelPlacement="floating"
                      mode="md"
                      value={organizationalUnityInfo.managementGroup}
                      onIonInput={(e) => {
                        setOrganizationalUnityInfo({
                          ...organizationalUnityInfo,
                          managementGroup: String(e.target.value),
                        });
                        if (errors.managementGroup)
                          setErrors({ ...errors, managementGroup: "" });
                      }}
                    />
                    {errors.managementGroup && (
                      <span className="text-danger">
                        {errors.managementGroup}
                      </span>
                    )}
                  </div>

                  <div className="col-12">
                    <IonInput
                      color={"dark"}
                      fill="outline"
                      placeholder="Agrupamento Divisão"
                      label="Agrupamento Divisão"
                      labelPlacement="floating"
                      mode="md"
                      value={organizationalUnityInfo.divisionalGrouping}
                      onIonInput={(e) => {
                        setOrganizationalUnityInfo({
                          ...organizationalUnityInfo,
                          divisionalGrouping: String(e.target.value),
                        });
                        if (errors.divisionalGrouping)
                          setErrors({ ...errors, divisionalGrouping: "" });
                      }}
                    />
                    {errors.divisionalGrouping && (
                      <span className="text-danger">
                        {errors.divisionalGrouping}
                      </span>
                    )}
                  </div>

                  <div className="col-12">
                    <IonInput
                      color={"dark"}
                      fill="outline"
                      placeholder="Agrupamento Setor"
                      label="Agrupamento Setor"
                      labelPlacement="floating"
                      mode="md"
                      value={organizationalUnityInfo.sectorGrouping}
                      onIonInput={(e) => {
                        setOrganizationalUnityInfo({
                          ...organizationalUnityInfo,
                          sectorGrouping: String(e.target.value),
                        });
                        if (errors.sectorGrouping)
                          setErrors({ ...errors, sectorGrouping: "" });
                      }}
                    />
                    {errors.name && (
                      <span className="text-danger">
                        {errors.sectorGrouping}
                      </span>
                    )}
                  </div>

                  <div className="col-12">
                    <IonItem>
                      <IonLabel position="stacked">Chefe</IonLabel>
                      <IonSelect
                        value={organizationalUnityInfo.managerId}
                        placeholder="Selecione um Chefe"
                        onIonChange={(e) => {
                          setOrganizationalUnityInfo({
                            ...organizationalUnityInfo,
                            managerId: e.detail.value,
                          });
                          if (errors.managerId)
                            setErrors({ ...errors, managerId: "" });
                        }}
                      >
                        {responsiblesLoading ? (
                          <IonSelectOption disabled>
                            Carregando chefes...
                          </IonSelectOption>
                        ) : (
                          responsibles.map((responsible) => (
                            <IonSelectOption
                              key={responsible.id}
                              value={responsible.id}
                            >
                              {responsible.name}
                            </IonSelectOption>
                          ))
                        )}
                      </IonSelect>
                    </IonItem>
                    {errors.managerId && (
                      <span className="text-danger">{errors.managerId}</span>
                    )}
                  </div>

                  <div className="col-12 d-flex justify-content-between">
                    <IonButton
                      color="medium"
                      onClick={() => history.push("/organizational-unities")}
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

export default EditOrganizationalUnity;
