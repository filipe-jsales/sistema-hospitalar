import React, { useState, useEffect } from "react";
import {
  IonRow,
  IonCol,
  IonGrid,
  IonCard,
  IonCardContent,
  IonSpinner,
} from "@ionic/react";
import {
  fetchNotifications,
  setNotificationFilters,
} from "../../store/slices/notification/fetchNotificationsSlice";
import "./Dashboard.css";
import { useAppSelector } from "../../store/hooks";
import PeriodSelector from "../../components/Dashboard/PeriodSelector";
import NotificationResponsibleSelector from "../../components/Dashboard/NotificationResponsibleSelector";
import NotificationCounter from "../../components/Dashboard/NotificationCounter";
import NotificationIncidentClassificationChart from "../../components/Dashboard/NotificationIncidentClassificationChart";
import NotificationThemeChart from "../../components/Dashboard/NotificationThemeChart";
import IncidentDescriptionTable from "../../components/Dashboard/IncidentDescriptionTable";
import NotificationNotifyingServicesChart from "../../components/Dashboard/NotificationNotifyingServicesChart";
import NotificationExpiredDeadlineChart from "../../components/Dashboard/NotificationExpiredDeadlineChart";
import { PeriodFilter } from "../../utils/types";
import { useTypedDispatch } from "../../hooks/useRedux";

const Dashboard: React.FC = () => {
  const dispatch = useTypedDispatch();
  const [currentFilter, setCurrentFilter] = useState<PeriodFilter>({});
  const [selectedResponsibleId, setSelectedResponsibleId] = useState<
    number | null
  >(null);

  const { loading: notificationsLoading, error: notificationsError } =
    useAppSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications({ page: 1, limit: 10 }));
  }, [dispatch]);

  const applyFilters = (
    periodFilter: PeriodFilter,
    responsibleId: number | null
  ) => {
    const apiFilters = {
      page: 1,
      limit: 10,
      ...(periodFilter.year && { year: periodFilter.year }),
      ...(periodFilter.months &&
        periodFilter.months.length > 0 && { months: periodFilter.months }),
      ...(responsibleId !== null && { responsibleId }),
    };
    dispatch(setNotificationFilters(apiFilters));
    dispatch(fetchNotifications(apiFilters));
  };

  const handleFilterChange = (filter: PeriodFilter) => {
    setCurrentFilter(filter);
    applyFilters(filter, selectedResponsibleId);
  };

  const handleResponsibleChange = (responsibleId: number | null) => {
    setSelectedResponsibleId(responsibleId);
    applyFilters(currentFilter, responsibleId);
  };

  return (
    <IonGrid className="dashboard-container">
      {notificationsError && (
        <IonRow>
          <IonCol>
            <IonCard color="danger">
              <IonCardContent>
                <p className="ion-text-center">{notificationsError}</p>
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
          <IonCard>
            <IonCardContent>
              <NotificationResponsibleSelector
                selectedResponsibleId={selectedResponsibleId}
                onResponsibleChange={handleResponsibleChange}
              />
            </IonCardContent>
          </IonCard>
        </IonCol>
        <IonCol size="12" size-md="4">
          {notificationsLoading ? (
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
      </IonRow>

      <IonRow>
        <IonCol size="12" size-md="6">
          <IonCard>
            <IonCardContent>
              <h2>CLASSIFICAÇÃO DOS INCIDENTES</h2>
              {notificationsLoading ? (
                <div className="chart-loading">
                  <IonSpinner name="crescent" />
                  <p>Carregando dados de incidentes...</p>
                </div>
              ) : (
                <NotificationIncidentClassificationChart />
              )}
            </IonCardContent>
          </IonCard>
        </IonCol>
        <IonCol size="12" size-md="6">
          <IonCard>
            <IonCardContent>
              <h2>TEMAS</h2>
              {notificationsLoading ? (
                <div className="chart-loading">
                  <IonSpinner name="crescent" />
                  <p>Carregando dados dos temas...</p>
                </div>
              ) : (
                <NotificationThemeChart />
              )}
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="12" size-md="6">
          <IonCard>
            <IonCardContent>
              <h2>DESCRIÇÃO</h2>
              {notificationsLoading ? (
                <div className="chart-loading">
                  <IonSpinner name="crescent" />
                  <p>Carregando dados de notificações...</p>
                </div>
              ) : (
                <IncidentDescriptionTable />
              )}
            </IonCardContent>
          </IonCard>
        </IonCol>
        <IonCol size="12" size-md="6">
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardContent>
                  <h2>SERVIÇOS NOTIFICANTES</h2>
                  {notificationsLoading ? (
                    <div className="chart-loading">
                      <IonSpinner name="crescent" />
                      <p>Carregando dados dos serviços notificantes...</p>
                    </div>
                  ) : (
                    <NotificationNotifyingServicesChart />
                  )}
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardContent>
                  <h2>PRAZOS EXPIRADOS</h2>
                  <NotificationExpiredDeadlineChart />
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default Dashboard;
