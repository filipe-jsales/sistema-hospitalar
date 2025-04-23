import {
  IonContent,
  IonPage,
  IonCard,
  IonCardContent,
  IonInput,
  IonButton,
  IonSpinner,
  IonTextarea,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
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
import Header from "../../components/Header/Header";
import { fetchCategories } from "../../store/slices/category/fetchCategoriesSlice";
import { fetchThemes } from "../../store/slices/theme/fetchThemesSlice";
import { fetchNotifyingServices } from "../../store/slices/notifyingService/fetchNotifyingServicesSlice";
import { fetchOrganizationalUnities } from "../../store/slices/organizationalUnity/fetchOrganizationalUnitiesSlice";
import { fetchResponsibles } from "../../store/slices/responsible/fetchResponsiblesSlice";
import { fetchIncidents } from "../../store/slices/incident/fetchIncidentsSlice";
import { fetchPriorities } from "../../store/slices/priority/fetchPrioritiesSlice";
import { fetchSubcategories } from "../../store/slices/subcategory/fetchSubcategoriesSlice";

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

  useEffect(() => {
    dispatch(fetchCategories({ page: 1 }));
    dispatch(fetchThemes({ page: 1 }));
    dispatch(fetchSubcategories({ page: 1 }));
    dispatch(fetchNotifyingServices({ page: 1 }));
    dispatch(fetchOrganizationalUnities({ page: 1 }));
    dispatch(fetchResponsibles({ page: 1 }));
    dispatch(fetchIncidents({ page: 1 }));
    dispatch(fetchPriorities({ page: 1 }));
  }, [dispatch]);

  const {
    categories = [],
    loading: categoriesLoading,
    error: categoriesError,
  } = useAppSelector((state) => state.categories || { categories: [] });

  const {
    themes = [],
    loading: themesLoading,
    error: themesError,
  } = useAppSelector((state) => state.themes || { themes: [] });

  const {
    subcategories = [],
    loading: subcategoriesLoading,
    error: subcategoriesError,
  } = useAppSelector((state) => state.subcategories || { subcategories: [] });

  const {
    notifyingServices = [],
    loading: notifyingServicesLoading,
    error: notifyingServicesError,
  } = useAppSelector(
    (state) => state.notifyingServices || { notifyingServices: [] }
  );

  const {
    organizationalUnities = [],
    loading: organizationalUnitiesLoading,
    error: organizationalUnitiesError,
  } = useAppSelector(
    (state) => state.organizationalUnities || { organizationalUnities: [] }
  );

  const {
    responsibles = [],
    loading: responsiblesLoading,
    error: responsiblesError,
  } = useAppSelector((state) => state.responsibles || { responsibles: [] });

  const {
    incidents = [],
    loading: incidentsLoading,
    error: incidentsError,
  } = useAppSelector((state) => state.incidents || { incidents: [] });

  const {
    priorities = [],
    loading: prioritiesLoading,
    error: prioritiesError,
  } = useAppSelector((state) => state.priorities || { priorities: [] });

  const [notificationInfo, setNotificationInfo] = useState({
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
    themeId: null as number | null,
    subcategoryId: null as number | null,
    notifyingServiceId: null as number | null,
    organizationalUnityId: null as number | null,
    incidentId: null as number | null,
    responsibleId: null as number | null,
    priorityId: null as number | null,
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
        processSEI: notification.processSEI || "",
        observations: notification.observations || "",
        actionPlan: notification.actionPlan || "",
        situation: notification.situation || "",
        anvisaNotification: notification.anvisaNotification || "",
        notificationNumber: notification.notificationNumber || "",
        initialDate: notification.initialDate || "",
        endDate: notification.endDate || "",
        categoryId: notification.categoryId || null,
        themeId: notification.themeId || null,
        subcategoryId: notification.subcategoryId || null,
        notifyingServiceId: notification.notifyingServiceId || null,
        organizationalUnityId: notification.organizationalUnityId || null,
        incidentId: notification.incidentId || null,
        responsibleId: notification.responsibleId || null,
        priorityId: notification.priorityId || null,
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
      <Header />

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
                      placeholder="Descrição"
                      label="Descrição"
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

                  <div className="col-12">
                    <IonTextarea
                      color={"dark"}
                      fill="outline"
                      placeholder="Processo SEI"
                      label="Processo SEI"
                      labelPlacement="floating"
                      rows={4}
                      mode="md"
                      value={notificationInfo.processSEI}
                      onIonInput={(e) => {
                        setNotificationInfo({
                          ...notificationInfo,
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
                      value={notificationInfo.observations}
                      onIonInput={(e) => {
                        setNotificationInfo({
                          ...notificationInfo,
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
                      value={notificationInfo.actionPlan}
                      onIonInput={(e) => {
                        setNotificationInfo({
                          ...notificationInfo,
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
                      value={notificationInfo.notificationNumber}
                      onIonInput={(e) => {
                        setNotificationInfo({
                          ...notificationInfo,
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
                      value={notificationInfo.anvisaNotification}
                      onIonInput={(e) => {
                        setNotificationInfo({
                          ...notificationInfo,
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
                      value={notificationInfo.initialDate}
                      onIonInput={(e) => {
                        setNotificationInfo({
                          ...notificationInfo,
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
                      value={notificationInfo.endDate}
                      onIonInput={(e) => {
                        setNotificationInfo({
                          ...notificationInfo,
                          endDate: String(e.target.value),
                        });
                        if (errors.endDate)
                          setErrors({ ...errors, endDate: "" });
                      }}
                    />
                    {errors.endDate && (
                      <span className="text-danger">{errors.endDate}</span>
                    )}
                  </div>

                  <div className="col-12">
                    <IonItem>
                      <IonLabel position="stacked">
                        Serviço Notificante
                      </IonLabel>
                      <IonSelect
                        value={notificationInfo.notifyingServiceId}
                        placeholder="Selecione Serviço Notificante"
                        onIonChange={(e) => {
                          setNotificationInfo({
                            ...notificationInfo,
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
                        value={notificationInfo.themeId}
                        placeholder="Selecione um tema"
                        onIonChange={(e) => {
                          setNotificationInfo({
                            ...notificationInfo,
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
                        value={notificationInfo.incidentId}
                        placeholder="Selecione um Incidente"
                        onIonChange={(e) => {
                          setNotificationInfo({
                            ...notificationInfo,
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
                        value={notificationInfo.responsibleId}
                        placeholder="Selecione um responsável"
                        onIonChange={(e) => {
                          setNotificationInfo({
                            ...notificationInfo,
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
                      <span className="text-danger">
                        {errors.responsibleId}
                      </span>
                    )}
                  </div>

                  <div className="col-12">
                    <IonItem>
                      <IonLabel position="stacked">Subcategoria</IonLabel>
                      <IonSelect
                        value={notificationInfo.subcategoryId}
                        placeholder="Selecione uma subcategoria"
                        onIonChange={(e) => {
                          setNotificationInfo({
                            ...notificationInfo,
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
                      <span className="text-danger">
                        {errors.subcategoryId}
                      </span>
                    )}
                  </div>

                  <div className="col-12">
                    <IonItem>
                      <IonLabel position="stacked">
                        Unidade Organizacional
                      </IonLabel>
                      <IonSelect
                        value={notificationInfo.organizationalUnityId}
                        placeholder="Selecione uma unidade organizacional"
                        onIonChange={(e) => {
                          setNotificationInfo({
                            ...notificationInfo,
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
                        value={notificationInfo.categoryId}
                        placeholder="Selecione uma categoria"
                        onIonChange={(e) => {
                          setNotificationInfo({
                            ...notificationInfo,
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
                        value={notificationInfo.priorityId}
                        placeholder="Selecione uma Prioridade"
                        onIonChange={(e) => {
                          setNotificationInfo({
                            ...notificationInfo,
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
