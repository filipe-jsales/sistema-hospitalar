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
import NotificationNumber from "../../components/Dashboard/NotificationNumber";
import IncidentClassificationChart from "../../components/Dashboard/IncidentClassificationChart";
import ThemeChart from "../../components/Dashboard/ThemeChart";
import IncidentDescriptionTable from "../../components/Dashboard/IncidentDescriptionTable";
import NotifyingServicesChart from "../../components/Dashboard/NotifyingServicesChart";
import ExpiredTermsChart from "../../components/Dashboard/ExpiredTermsChart";
import { PeriodType } from "../../utils/types";
import { useTypedDispatch } from "../../hooks/useRedux";

const Dashboard: React.FC = () => {
  const dispatch = useTypedDispatch();
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("Todos");
  const { loading, error } = useAppSelector((state) => state.notifications);

  useEffect(() => {
    dispatch(fetchNotifications(1));
  }, [dispatch]);

  const handlePeriodChange = (period: PeriodType) => {
    setSelectedPeriod(period);
  };

  return (
    <IonGrid className="dashboard-container">
      {error && (
        <IonRow>
          <IonCol>
            <IonCard color="danger">
              <IonCardContent>
                <p className="ion-text-center">{error}</p>
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
                selectedPeriod={selectedPeriod}
                onPeriodChange={handlePeriodChange}
              />
            </IonCardContent>
          </IonCard>
        </IonCol>
        <IonCol size="12" size-md="4">
          {loading && !error ? (
            <IonCard>
              <IonCardContent className="ion-text-center">
                <IonSpinner name="crescent" />
                <p>Carregando...</p>
              </IonCardContent>
            </IonCard>
          ) : (
            <NotificationCounter period={selectedPeriod} />
          )}
        </IonCol>
        <IonCol size="12" size-md="4">
          {loading && !error ? (
            <IonCard>
              <IonCardContent className="ion-text-center">
                <IonSpinner name="crescent" />
                <p>Carregando...</p>
              </IonCardContent>
            </IonCard>
          ) : (
            <NotificationNumber period={selectedPeriod} />
          )}
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="12" size-md="6">
          <IonCard>
            <IonCardContent>
              <h2>CLASSIFICAÇÃO DOS INCIDENTES</h2>
              <IncidentClassificationChart period={selectedPeriod} />
            </IonCardContent>
          </IonCard>
        </IonCol>
        <IonCol size="12" size-md="6">
          <IonCard>
            <IonCardContent>
              <h2>TEMAS</h2>
              <ThemeChart period={selectedPeriod} />
            </IonCardContent>
          </IonCard>
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="12" size-md="6">
          <IonCard>
            <IonCardContent>
              <h2>DESCRIÇÃO</h2>
              <IncidentDescriptionTable period={selectedPeriod} />
            </IonCardContent>
          </IonCard>
        </IonCol>
        <IonCol size="12" size-md="6">
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardContent>
                  <h2>SERVIÇOS NOTIFICANTES</h2>
                  <NotifyingServicesChart period={selectedPeriod} />
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <IonCard>
                <IonCardContent>
                  <h2>PRAZOS EXPIRADOS</h2>
                  <ExpiredTermsChart period={selectedPeriod} />
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
