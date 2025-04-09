import React, { useState } from "react";
import { IonRow, IonCol, IonGrid, IonCard, IonCardContent } from "@ionic/react";
import "./Dashboard.css";
import PeriodSelector from "../../components/Dashboard/PeriodSelector";
import NotificationCounter from "../../components/Dashboard/NotificationCounter";
import NotificationNumber from "../../components/Dashboard/NotificationNumber";
import IncidentClassificationChart from "../../components/Dashboard/IncidentClassificationChart";
import ThemeChart from "../../components/Dashboard/ThemeChart";
import IncidentDescriptionTable from "../../components/Dashboard/IncidentDescriptionTable";
import NotifyingServicesChart from "../../components/Dashboard/NotifyingServicesChart";
import ExpiredTermsChart from "../../components/Dashboard/ExpiredTermsChart";

const Dashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("Todos");

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  };

  return (
    <IonGrid className="dashboard-container">
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
          <NotificationCounter period={selectedPeriod} />
        </IonCol>
        <IonCol size="12" size-md="4">
          <NotificationNumber period={selectedPeriod} />
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
