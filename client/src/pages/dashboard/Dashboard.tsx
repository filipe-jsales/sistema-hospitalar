import React, { useState, useEffect } from "react";
import {
  IonRow,
  IonCol,
  IonGrid,
  IonCard,
  IonCardContent,
  IonSpinner,
} from "@ionic/react";
import { fetchNotifications } from "../../store/slices/notification/fetchNotificationsSlice";
import "./Dashboard.css";
import { useAppSelector } from "../../store/hooks";
import PeriodSelector from "../../components/Dashboard/PeriodSelector";
import NotificationCounter from "../../components/Dashboard/NotificationCounter";
import IncidentClassificationChart from "../../components/Dashboard/IncidentClassificationChart";
import ThemeChart from "../../components/Dashboard/ThemeChart";
import NotifyingServicesChart from "../../components/Dashboard/NotifyingServicesChart";
import { PeriodFilter } from "../../utils/types";
import { useTypedDispatch } from "../../hooks/useRedux";
import {
  fetchThemes,
  setThemesFilters,
} from "../../store/slices/theme/fetchThemesSlice";
import {
  fetchIncidents,
  setIncidentsFilters,
} from "../../store/slices/incident/fetchIncidentsSlice";
import {
  fetchNotifyingServices,
  setNotifyingFilters,
} from "../../store/slices/notifyingService/fetchNotifyingServicesSlice";

// TODO: ajustar os demais componentes para ficar de acordo com os novos slices
const Dashboard: React.FC = () => {
  const dispatch = useTypedDispatch();
  const [currentFilter, setCurrentFilter] = useState<PeriodFilter>({});

  const { loading: notificationsLoading, error: notificationsError } =
    useAppSelector((state) => state.notifications);
  const { loading: themesLoading, error: themesError } = useAppSelector(
    (state) => state.themes
  );

  useEffect(() => {
    dispatch(fetchNotifications({ page: 1, limit: 10 }));
    dispatch(fetchThemes({ page: 1, limit: 10 }));
    dispatch(fetchIncidents({ page: 1, limit: 10 }));
    dispatch(fetchNotifyingServices({ page: 1, limit: 10 }));
  }, [dispatch]);

  const handleFilterChange = (filter: PeriodFilter) => {
    setCurrentFilter(filter);

    const apiFilters = {
      page: 1,
      limit: 10,
      ...(filter.year && { year: filter.year }),
      ...(filter.months &&
        filter.months.length > 0 && { months: filter.months }),
    };

    dispatch(setThemesFilters(apiFilters));
    dispatch(setIncidentsFilters(apiFilters));
    dispatch(setNotifyingFilters(apiFilters));

    dispatch(fetchThemes(apiFilters));
    dispatch(fetchIncidents(apiFilters));
    dispatch(fetchNotifyingServices(apiFilters));
    dispatch(fetchNotifications(apiFilters));
  };

  const hasError = notificationsError || themesError;

  return (
    <IonGrid className="dashboard-container">
      {hasError && (
        <IonRow>
          <IonCol>
            <IonCard color="danger">
              <IonCardContent>
                <p className="ion-text-center">
                  {notificationsError || themesError}
                </p>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      )}

      <IonRow>
        <IonCol size="12" size-md="4">
          <IonCard>
            <IonCardContent>
              <PeriodSelector
                selectedFilter={currentFilter}
                onFilterChange={handleFilterChange}
              />
            </IonCardContent>
          </IonCard>
        </IonCol>
        <IonCol size="12" size-md="4">
          {notificationsLoading && !notificationsError ? (
            <IonCard>
              <IonCardContent className="ion-text-center">
                <IonSpinner name="crescent" />
                <p>Carregando...</p>
              </IonCardContent>
            </IonCard>
          ) : (
            <NotificationCounter />
          )}
        </IonCol>
        <IonCol size="12" size-md="4">
          {notificationsLoading && !notificationsError ? (
            <IonCard>
              <IonCardContent className="ion-text-center">
                <IonSpinner name="crescent" />
                <p>Carregando...</p>
              </IonCardContent>
            </IonCard>
          ) : (
            // <VigihostNotificationCounter
            //   period={convertFilterToLegacyPeriod(currentFilter)}
            // />
            <h1>TODO: VIGIHOST</h1>
          )}
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="12" size-md="6">
          <IonCard>
            <IonCardContent>
              <h2>CLASSIFICAÇÃO DOS INCIDENTES</h2>
              <IncidentClassificationChart />
            </IonCardContent>
          </IonCard>
        </IonCol>
        <IonCol size="12" size-md="6">
          <IonCard>
            <IonCardContent>
              <h2>TEMAS</h2>
              {themesLoading ? (
                <div className="chart-loading">
                  <IonSpinner name="crescent" />
                  <p>Carregando dados dos temas...</p>
                </div>
              ) : (
                <ThemeChart />
              )}
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>

      <IonRow>
        {/* TODO: perguntar qual referencia dessa tabela */}
        {/* <IonCol size="12" size-md="6">
          <IonCard>
            <IonCardContent>
              <h2>DESCRIÇÃO</h2>
              <IncidentDescriptionTable
                period={convertFilterToLegacyPeriod(currentFilter)}
              />
            </IonCardContent>
          </IonCard>
        </IonCol> */}
        <IonCol size="12" size-md="6">
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardContent>
                  <h2>SERVIÇOS NOTIFICANTES</h2>
                  <NotifyingServicesChart />
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          {/* <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardContent>
                  <h2>PRAZOS EXPIRADOS</h2>
                  <ExpiredTermsChart
                    period={convertFilterToLegacyPeriod(currentFilter)}
                  />
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow> */}
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default Dashboard;
