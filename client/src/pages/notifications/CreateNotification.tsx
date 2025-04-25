import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonButton,
  IonSpinner,
  IonTextarea,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  createNotification,
  clearError,
  clearSuccessMessage,
} from "../../store/slices/notification/createNotificationSlice";
import { useFormCleanup } from "../../hooks/useFormCleanup";
import { fetchCategories } from "../../store/slices/category/fetchCategoriesSlice";
import { fetchThemes } from "../../store/slices/theme/fetchThemesSlice";
import { fetchSubcategories } from "../../store/slices/subcategory/fetchSubcategoriesSlice";
import { fetchNotifyingServices } from "../../store/slices/notifyingService/fetchNotifyingServicesSlice";
import { fetchOrganizationalUnities } from "../../store/slices/organizationalUnity/fetchOrganizationalUnitiesSlice";
import { fetchResponsibles } from "../../store/slices/responsible/fetchResponsiblesSlice";
import { fetchIncidents } from "../../store/slices/incident/fetchIncidentsSlice";
import { fetchPriorities } from "../../store/slices/priority/fetchPrioritiesSlice";
import Header from "../../components/Header/Header";

const CreateNotification: React.FC = () => {
  const [notificationInfos, setNotificationInfos] = useState({
    description: "",
    processSEI: "",
    observations: "",
    actionPlan: "",
    situation: "",
    anvisaNotification: "",
    notificationNumber: "",
    initialDate: "",
    endDate: "",
    categoryId: null as number | null,
    themeId: null,
    subcategoryId: null,
    notifyingServiceId: null,
    organizationalUnityId: null,
    incidentId: null,
    responsibleId: null,
    priorityId: null,
  });

  const [errors, setErrors] = useState({
    description: "",
    processSEI: "",
    observations: "",
    actionPlan: "",
    situation: "",
    anvisaNotification: "",
    notificationNumber: "",
    initialDate: "",
    endDate: "",
    categoryId: "",
    themeId: "",
    subcategoryId: "",
    notifyingServiceId: "",
    organizationalUnityId: "",
    incidentId: "",
    responsibleId: "",
    priorityId: "",
  });

  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { loading, error, successMessage } = useAppSelector(
    (state) => state.createNotification
  );

  const { categories = [], loading: categoriesLoading } = useAppSelector(
    (state) => state.categories || { categories: [] }
  );

  const { themes = [], loading: themesLoading } = useAppSelector(
    (state) => state.themes || { themes: [] }
  );

  const { subcategories = [], loading: subcategoriesLoading } = useAppSelector(
    (state) => state.subcategories || { subcategories: [] }
  );

  const { notifyingServices = [], loading: notifyingServicesLoading } =
    useAppSelector(
      (state) => state.notifyingServices || { notifyingServices: [] }
    );

  const { organizationalUnities = [], loading: organizationalUnitiesLoading } =
    useAppSelector(
      (state) => state.organizationalUnities || { organizationalUnities: [] }
    );

  const { responsibles = [], loading: responsiblesLoading } = useAppSelector(
    (state) => state.responsibles || { responsibles: [] }
  );

  const { incidents = [], loading: incidentsLoading } = useAppSelector(
    (state) => state.incidents || { incidents: [] }
  );

  const { priorities = [], loading: prioritiesLoading } = useAppSelector(
    (state) => state.priorities || { priorities: [] }
  );

  const fetchActions = [
    { action: () => fetchCategories({ page: 1 }), name: "categorias" },
    { action: () => fetchThemes({ page: 1 }), name: "temas" },
    { action: () => fetchSubcategories({ page: 1 }), name: "subcategorias" },
    {
      action: () => fetchNotifyingServices({ page: 1 }),
      name: "serviços notificantes",
    },
    {
      action: () => fetchOrganizationalUnities({ page: 1 }),
      name: "unidades organizacionais",
    },
    { action: () => fetchResponsibles({ page: 1 }), name: "responsáveis" },
    { action: () => fetchIncidents({ page: 1 }), name: "incidentes" },
    { action: () => fetchPriorities({ page: 1 }), name: "prioridades" },
  ];

  useEffect(() => {
    fetchActions.forEach(({ action, name }) => {
      const actionResult = action();
      dispatch(actionResult as ReturnType<typeof action>)
        .unwrap()
        .catch((error: unknown) => {
          console.error(`Falha ao carregar ${name}:`, error);
        });
    });
  }, [dispatch]);

  useFormCleanup({
    dispatch,
    clearError,
    clearSuccessMessage,
    resetFormState: () => {
      setNotificationInfos({
        description: "",
        processSEI: "",
        observations: "",
        actionPlan: "",
        situation: "",
        anvisaNotification: "",
        notificationNumber: "",
        initialDate: "",
        endDate: "",
        categoryId: null,
        themeId: null,
        subcategoryId: null,
        notifyingServiceId: null,
        organizationalUnityId: null,
        incidentId: null,
        responsibleId: null,
        priorityId: null,
      });
    },
    resetFormErrors: () => {
      setErrors({
        description: "",
        processSEI: "",
        observations: "",
        actionPlan: "",
        situation: "",
        anvisaNotification: "",
        notificationNumber: "",
        initialDate: "",
        endDate: "",
        categoryId: "",
        themeId: "",
        subcategoryId: "",
        notifyingServiceId: "",
        organizationalUnityId: "",
        incidentId: "",
        responsibleId: "",
        priorityId: "",
      });
    },
  });

  const validateInputs = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newErrors: any = {};
    if (!notificationInfos.description.trim())
      newErrors.description = "Campo obrigatório.";
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
          description: notificationInfos.description,
          processSEI: notificationInfos.processSEI,
          observations: notificationInfos.observations,
          actionPlan: notificationInfos.actionPlan,
          situation: notificationInfos.situation,
          anvisaNotification: notificationInfos.anvisaNotification,
          notificationNumber: Number(notificationInfos.notificationNumber),
          initialDate: notificationInfos.initialDate,
          endDate: notificationInfos.endDate,
          categoryId: notificationInfos.categoryId,
          themeId: notificationInfos.themeId,
          subcategoryId: notificationInfos.subcategoryId,
          notifyingServiceId: notificationInfos.notifyingServiceId,
          organizationalUnityId: notificationInfos.organizationalUnityId,
          incidentId: notificationInfos.incidentId,
          responsibleId: notificationInfos.responsibleId,
          priorityId: notificationInfos.priorityId,
        };
        dispatch(createNotification(payload))
          .unwrap()
          .then(() => {
            setNotificationInfos({
              description: "",
              processSEI: "",
              observations: "",
              actionPlan: "",
              situation: "",
              anvisaNotification: "",
              notificationNumber: "",
              initialDate: "",
              endDate: "",
              categoryId: null,
              themeId: null,
              subcategoryId: null,
              notifyingServiceId: null,
              organizationalUnityId: null,
              incidentId: null,
              responsibleId: null,
              priorityId: null,
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
      <Header />
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
                  <IonTextarea
                    color={"dark"}
                    fill="outline"
                    placeholder="Processo SEI"
                    label="Processo SEI"
                    labelPlacement="floating"
                    rows={4}
                    mode="md"
                    value={notificationInfos.processSEI}
                    onIonInput={(e) => {
                      setNotificationInfos({
                        ...notificationInfos,
                        processSEI: String(e.target.value),
                      });
                      if (errors.processSEI)
                        setErrors({ ...errors, processSEI: "" });
                    }}
                  />
                  {errors.processSEI && (
                    <span className="text-danger">{errors.processSEI}</span>
                  )}
                </div>

                <div className="col-12">
                  <IonTextarea
                    color={"dark"}
                    fill="outline"
                    placeholder="Observações"
                    label="Observações"
                    labelPlacement="floating"
                    rows={4}
                    mode="md"
                    value={notificationInfos.observations}
                    onIonInput={(e) => {
                      setNotificationInfos({
                        ...notificationInfos,
                        observations: String(e.target.value),
                      });
                      if (errors.observations)
                        setErrors({ ...errors, observations: "" });
                    }}
                  />
                  {errors.observations && (
                    <span className="text-danger">{errors.observations}</span>
                  )}
                </div>

                <div className="col-12">
                  <IonTextarea
                    color={"dark"}
                    fill="outline"
                    placeholder="Plano de Ação"
                    label="Plano de Ação"
                    labelPlacement="floating"
                    rows={4}
                    mode="md"
                    value={notificationInfos.actionPlan}
                    onIonInput={(e) => {
                      setNotificationInfos({
                        ...notificationInfos,
                        actionPlan: String(e.target.value),
                      });
                      if (errors.actionPlan)
                        setErrors({ ...errors, actionPlan: "" });
                    }}
                  />
                  {errors.actionPlan && (
                    <span className="text-danger">{errors.actionPlan}</span>
                  )}
                </div>

                <div className="col-12">
                  <IonInput
                    color={"dark"}
                    fill="outline"
                    placeholder="Número da notificação"
                    label="Número da notificação"
                    labelPlacement="floating"
                    type="number"
                    min={0}
                    mode="md"
                    value={notificationInfos.notificationNumber}
                    onIonInput={(e) => {
                      setNotificationInfos({
                        ...notificationInfos,
                        notificationNumber: String(e.target.value),
                      });
                      if (errors.notificationNumber)
                        setErrors({ ...errors, notificationNumber: "" });
                    }}
                  />
                  {errors.notificationNumber && (
                    <span className="text-danger">
                      {errors.notificationNumber}
                    </span>
                  )}
                </div>

                <div className="col-12">
                  <IonTextarea
                    color={"dark"}
                    fill="outline"
                    placeholder="Notificação ANVISA"
                    label="Notificação ANVISA"
                    labelPlacement="floating"
                    rows={2}
                    mode="md"
                    value={notificationInfos.anvisaNotification}
                    onIonInput={(e) => {
                      setNotificationInfos({
                        ...notificationInfos,
                        anvisaNotification: String(e.target.value),
                      });
                      if (errors.anvisaNotification)
                        setErrors({ ...errors, anvisaNotification: "" });
                    }}
                  />
                  {errors.anvisaNotification && (
                    <span className="text-danger">
                      {errors.anvisaNotification}
                    </span>
                  )}
                </div>

                <div className="col-12">
                  <IonInput
                    color={"dark"}
                    fill="outline"
                    placeholder="initialDate"
                    label="initialDate"
                    labelPlacement="floating"
                    type="date"
                    mode="md"
                    value={notificationInfos.initialDate}
                    onIonInput={(e) => {
                      setNotificationInfos({
                        ...notificationInfos,
                        initialDate: String(e.target.value),
                      });
                      if (errors.initialDate)
                        setErrors({ ...errors, initialDate: "" });
                    }}
                  />
                  {errors.initialDate && (
                    <span className="text-danger">{errors.initialDate}</span>
                  )}
                </div>

                <div className="col-12">
                  <IonInput
                    color={"dark"}
                    fill="outline"
                    placeholder="endDate"
                    label="endDate"
                    labelPlacement="floating"
                    type="date"
                    mode="md"
                    value={notificationInfos.endDate}
                    onIonInput={(e) => {
                      setNotificationInfos({
                        ...notificationInfos,
                        endDate: String(e.target.value),
                      });
                      if (errors.endDate) setErrors({ ...errors, endDate: "" });
                    }}
                  />
                  {errors.endDate && (
                    <span className="text-danger">{errors.endDate}</span>
                  )}
                </div>

                <div className="col-12">
                  <IonItem>
                    <IonLabel position="stacked">Serviço Notificante</IonLabel>
                    <IonSelect
                      value={notificationInfos.notifyingServiceId}
                      placeholder="Selecione Serviço Notificante"
                      onIonChange={(e) => {
                        setNotificationInfos({
                          ...notificationInfos,
                          notifyingServiceId: e.detail.value,
                        });
                        if (errors.notifyingServiceId)
                          setErrors({ ...errors, notifyingServiceId: "" });
                      }}
                    >
                      {notifyingServicesLoading ? (
                        <IonSelectOption disabled>
                          Carregando serviços notificantes...
                        </IonSelectOption>
                      ) : (
                        Array.isArray(notifyingServices) &&
                        notifyingServices.map((notifyingService) => (
                          <IonSelectOption
                            key={notifyingService.id}
                            value={notifyingService.id}
                          >
                            {notifyingService.name}
                          </IonSelectOption>
                        ))
                      )}
                    </IonSelect>
                  </IonItem>
                  {errors.notifyingServiceId && (
                    <span className="text-danger">
                      {errors.notifyingServiceId}
                    </span>
                  )}
                </div>

                <div className="col-12">
                  <IonItem>
                    <IonLabel position="stacked">Tema</IonLabel>
                    <IonSelect
                      value={notificationInfos.themeId}
                      placeholder="Selecione um tema"
                      onIonChange={(e) => {
                        setNotificationInfos({
                          ...notificationInfos,
                          themeId: e.detail.value,
                        });
                        if (errors.themeId)
                          setErrors({ ...errors, themeId: "" });
                      }}
                    >
                      {themesLoading ? (
                        <IonSelectOption disabled>
                          Carregando temas...
                        </IonSelectOption>
                      ) : (
                        Array.isArray(themes) &&
                        themes.map((theme) => (
                          <IonSelectOption key={theme.id} value={theme.id}>
                            {theme.name}
                          </IonSelectOption>
                        ))
                      )}
                    </IonSelect>
                  </IonItem>
                  {errors.themeId && (
                    <span className="text-danger">{errors.themeId}</span>
                  )}
                </div>

                <div className="col-12">
                  <IonItem>
                    <IonLabel position="stacked">Incidente</IonLabel>
                    <IonSelect
                      value={notificationInfos.incidentId}
                      placeholder="Selecione um Incidente"
                      onIonChange={(e) => {
                        setNotificationInfos({
                          ...notificationInfos,
                          incidentId: e.detail.value,
                        });
                        if (errors.incidentId)
                          setErrors({ ...errors, incidentId: "" });
                      }}
                    >
                      {incidentsLoading ? (
                        <IonSelectOption disabled>
                          Carregando incidentes...
                        </IonSelectOption>
                      ) : (
                        Array.isArray(incidents) &&
                        incidents.map((incident) => (
                          <IonSelectOption
                            key={incident.id}
                            value={incident.id}
                          >
                            {incident.name}
                          </IonSelectOption>
                        ))
                      )}
                    </IonSelect>
                  </IonItem>
                  {errors.incidentId && (
                    <span className="text-danger">{errors.incidentId}</span>
                  )}
                </div>

                <div className="col-12">
                  <IonItem>
                    <IonLabel position="stacked">Responsável</IonLabel>
                    <IonSelect
                      value={notificationInfos.responsibleId}
                      placeholder="Selecione um responsável"
                      onIonChange={(e) => {
                        setNotificationInfos({
                          ...notificationInfos,
                          responsibleId: e.detail.value,
                        });
                        if (errors.responsibleId)
                          setErrors({ ...errors, responsibleId: "" });
                      }}
                    >
                      {responsiblesLoading ? (
                        <IonSelectOption disabled>
                          Carregando responsáveis...
                        </IonSelectOption>
                      ) : (
                        Array.isArray(responsibles) &&
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
                  {errors.responsibleId && (
                    <span className="text-danger">{errors.responsibleId}</span>
                  )}
                </div>

                <div className="col-12">
                  <IonItem>
                    <IonLabel position="stacked">Subcategoria</IonLabel>
                    <IonSelect
                      value={notificationInfos.subcategoryId}
                      placeholder="Selecione uma subcategoria"
                      onIonChange={(e) => {
                        setNotificationInfos({
                          ...notificationInfos,
                          subcategoryId: e.detail.value,
                        });
                        if (errors.subcategoryId)
                          setErrors({ ...errors, subcategoryId: "" });
                      }}
                    >
                      {subcategoriesLoading ? (
                        <IonSelectOption disabled>
                          Carregando subcategorias...
                        </IonSelectOption>
                      ) : (
                        Array.isArray(subcategories) &&
                        subcategories.map((subcategory) => (
                          <IonSelectOption
                            key={subcategory.id}
                            value={subcategory.id}
                          >
                            {subcategory.name}
                          </IonSelectOption>
                        ))
                      )}
                    </IonSelect>
                  </IonItem>
                  {errors.subcategoryId && (
                    <span className="text-danger">{errors.subcategoryId}</span>
                  )}
                </div>

                <div className="col-12">
                  <IonItem>
                    <IonLabel position="stacked">
                      Unidade Organizacional
                    </IonLabel>
                    <IonSelect
                      value={notificationInfos.organizationalUnityId}
                      placeholder="Selecione uma unidade organizacional"
                      onIonChange={(e) => {
                        setNotificationInfos({
                          ...notificationInfos,
                          organizationalUnityId: e.detail.value,
                        });
                        if (errors.organizationalUnityId)
                          setErrors({ ...errors, organizationalUnityId: "" });
                      }}
                    >
                      {organizationalUnitiesLoading ? (
                        <IonSelectOption disabled>
                          Carregando unidades organizacionais...
                        </IonSelectOption>
                      ) : (
                        Array.isArray(organizationalUnities) &&
                        organizationalUnities.map((organizationalUnity) => (
                          <IonSelectOption
                            key={organizationalUnity.id}
                            value={organizationalUnity.id}
                          >
                            {organizationalUnity.name}
                          </IonSelectOption>
                        ))
                      )}
                    </IonSelect>
                  </IonItem>
                  {errors.organizationalUnityId && (
                    <span className="text-danger">
                      {errors.organizationalUnityId}
                    </span>
                  )}
                </div>

                <div className="col-12">
                  <IonItem>
                    <IonLabel position="stacked">Categoria</IonLabel>
                    <IonSelect
                      value={notificationInfos.categoryId}
                      placeholder="Selecione uma categoria"
                      onIonChange={(e) => {
                        setNotificationInfos({
                          ...notificationInfos,
                          categoryId: e.detail.value,
                        });
                        if (errors.categoryId)
                          setErrors({ ...errors, categoryId: "" });
                      }}
                    >
                      {categoriesLoading ? (
                        <IonSelectOption disabled>
                          Carregando categorias...
                        </IonSelectOption>
                      ) : (
                        Array.isArray(categories) &&
                        categories.map((category) => (
                          <IonSelectOption
                            key={category.id}
                            value={category.id}
                          >
                            {category.name}
                          </IonSelectOption>
                        ))
                      )}
                    </IonSelect>
                  </IonItem>
                  {errors.categoryId && (
                    <span className="text-danger">{errors.categoryId}</span>
                  )}
                </div>

                <div className="col-12">
                  <IonItem>
                    <IonLabel position="stacked">Prioridade</IonLabel>
                    <IonSelect
                      value={notificationInfos.priorityId}
                      placeholder="Selecione uma Prioridade"
                      onIonChange={(e) => {
                        setNotificationInfos({
                          ...notificationInfos,
                          priorityId: e.detail.value,
                        });
                        if (errors.priorityId)
                          setErrors({ ...errors, priorityId: "" });
                      }}
                    >
                      {prioritiesLoading ? (
                        <IonSelectOption disabled>
                          Carregando prioridades...
                        </IonSelectOption>
                      ) : (
                        Array.isArray(priorities) &&
                        priorities.map((priority) => (
                          <IonSelectOption
                            key={priority.id}
                            value={priority.id}
                          >
                            {priority.name}
                          </IonSelectOption>
                        ))
                      )}
                    </IonSelect>
                  </IonItem>
                  {errors.priorityId && (
                    <span className="text-danger">{errors.priorityId}</span>
                  )}
                </div>

                <div className="col-12">
                  <IonButton
                    expand="block"
                    color="primary"
                    className="custom-button"
                    type="submit"
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
