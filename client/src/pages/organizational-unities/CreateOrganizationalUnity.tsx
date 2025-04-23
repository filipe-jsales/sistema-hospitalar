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
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  createOrganizationalUnity,
  clearError,
  clearSuccessMessage,
} from "../../store/slices/organizationalUnity/createOrganizationalUnitySlice";
import { useFormCleanup } from "../../hooks/useFormCleanup";
import Header from "../../components/Header/Header";
import { fetchResponsibles } from "../../store/slices/responsible/fetchResponsiblesSlice";

const CreateOrganizationalUnity: React.FC = () => {
  const [organizationalUnityInfos, setOrganizationalUnityInfos] = useState({
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

  const dispatch = useAppDispatch();
  const { isAuthenticated, user, token } = useAppSelector(
    (state) => state.auth
  );
  const { loading, error, successMessage } = useAppSelector(
    (state) => state.createOrganizationalUnity
  );

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

  useFormCleanup({
    dispatch,
    clearError,
    clearSuccessMessage,
    resetFormState: () => {
      setOrganizationalUnityInfos({
        name: "",
        acronym: "",
        organizationalAcronym: "",
        organizationalUnitType: "",
        managementGroup: "",
        divisionalGrouping: "",
        sectorGrouping: "",
        managerId: null,
      });
    },
    resetFormErrors: () => {
      setErrors({
        name: "",
        acronym: "",
        organizationalAcronym: "",
        organizationalUnitType: "",
        managementGroup: "",
        divisionalGrouping: "",
        sectorGrouping: "",
        managerId: "",
      });
    },
  });

  const validateInputs = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newErrors: any = {};
    if (!organizationalUnityInfos.name.trim())
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
          name: organizationalUnityInfos.name,
          acronym: organizationalUnityInfos.acronym,
          organizationalAcronym: organizationalUnityInfos.organizationalAcronym,
          organizationalUnitType:
            organizationalUnityInfos.organizationalUnitType,
          managementGroup: organizationalUnityInfos.managementGroup,
          divisionalGrouping: organizationalUnityInfos.divisionalGrouping,
          sectorGrouping: organizationalUnityInfos.sectorGrouping,
          managerId: organizationalUnityInfos.managerId,
        };
        dispatch(createOrganizationalUnity(payload))
          .unwrap()
          .then(() => {
            setOrganizationalUnityInfos({
              name: "",
              acronym: "",
              organizationalAcronym: "",
              organizationalUnitType: "",
              managementGroup: "",
              divisionalGrouping: "",
              sectorGrouping: "",
              managerId: null,
            });
          })
          .catch((error) => {
            console.error("Organizational Unity creation failed:", error);
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
              Cadastro de Unidade Organizacional
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
                    placeholder="Nome da Unidade Organizacional"
                    label="Nome da Unidade Organizacional"
                    labelPlacement="floating"
                    mode="md"
                    value={organizationalUnityInfos.name}
                    onIonInput={(e) => {
                      setOrganizationalUnityInfos({
                        ...organizationalUnityInfos,
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
                    value={organizationalUnityInfos.acronym}
                    onIonInput={(e) => {
                      setOrganizationalUnityInfos({
                        ...organizationalUnityInfos,
                        acronym: String(e.target.value),
                      });
                      if (errors.acronym) setErrors({ ...errors, acronym: "" });
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
                    value={organizationalUnityInfos.organizationalAcronym}
                    onIonInput={(e) => {
                      setOrganizationalUnityInfos({
                        ...organizationalUnityInfos,
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
                    value={organizationalUnityInfos.organizationalUnitType}
                    onIonInput={(e) => {
                      setOrganizationalUnityInfos({
                        ...organizationalUnityInfos,
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
                    value={organizationalUnityInfos.managementGroup}
                    onIonInput={(e) => {
                      setOrganizationalUnityInfos({
                        ...organizationalUnityInfos,
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
                    value={organizationalUnityInfos.divisionalGrouping}
                    onIonInput={(e) => {
                      setOrganizationalUnityInfos({
                        ...organizationalUnityInfos,
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
                    value={organizationalUnityInfos.sectorGrouping}
                    onIonInput={(e) => {
                      setOrganizationalUnityInfos({
                        ...organizationalUnityInfos,
                        sectorGrouping: String(e.target.value),
                      });
                      if (errors.sectorGrouping)
                        setErrors({ ...errors, sectorGrouping: "" });
                    }}
                  />
                  {errors.name && (
                    <span className="text-danger">{errors.sectorGrouping}</span>
                  )}
                </div>

                <div className="col-12">
                  <IonItem>
                    <IonLabel position="stacked">Chefe</IonLabel>
                    <IonSelect
                      value={organizationalUnityInfos.managerId}
                      placeholder="Selecione um Chefe"
                      onIonChange={(e) => {
                        setOrganizationalUnityInfos({
                          ...organizationalUnityInfos,
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

export default CreateOrganizationalUnity;
