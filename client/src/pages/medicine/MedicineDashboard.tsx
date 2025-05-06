import React, { useEffect } from "react";
import {
  IonRow,
  IonCol,
  IonGrid,
  IonCard,
  IonCardContent,
  IonSpinner,
  IonPage,
  IonContent,
} from "@ionic/react";
import { useTypedDispatch } from "../../hooks/useRedux";
import { useAppSelector } from "../../store/hooks";
import { fetchMedicationErrors } from "../../store/slices/medicationError/fetchMedicationErrorsSlice";
import MedicationErrorChart from "../../components/MedicineDashboard/MedicationErrorChart";
import MedicationErrorBarChart from "../../components/MedicineDashboard/MedicationErrorBarChart";
import Header from "../../components/Header/Header";

const MedicineDashboard: React.FC = () => {
  const dispatch = useTypedDispatch();

  const { medicationErrors, loading, error, groupedData } = useAppSelector(
    (state) => state.medicationErrors
  );

  useEffect(() => {
    dispatch(fetchMedicationErrors({ page: 1, limit: 10 }));
  }, [dispatch]);

  const preparePieChartData = () => {
    if (!groupedData) return [];

    const pieData = Object.entries(groupedData).map(([category, data]) => ({
      name: category,
      value:
        typeof data === "object" && data !== null && "total" in data
          ? (data as { total: number }).total
          : (data as number),
      percentage: 0,
    }));

    const total = pieData.reduce((acc, item) => acc + item.value, 0);
    return pieData.map((item) => ({
      ...item,
      percentage: Number(((item.value / total) * 100).toFixed(2)),
    }));
  };

  const prepareBarChartData = (category: string) => {
    if (!groupedData || !groupedData[category]) return [];

    if (
      typeof groupedData[category] === "object" &&
      groupedData[category] !== null &&
      "descriptions" in groupedData[category]
    ) {
      return Object.entries(
        (groupedData[category] as { descriptions: Record<string, number> })
          .descriptions
      ).map(([description, count]) => ({
        name: description,
        value: count as number,
      }));
    }

    return [];
  };

  return (
    <IonPage>
      <Header />
      <IonContent>
        <IonGrid className="medicine-dashboard-container">
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
            <IonCol size="12" size-md="6">
              <IonCard>
                <IonCardContent className="ion-text-center">
                  <h2>
                    TOTAL DE ERROS DE MEDICAÇÃO: {medicationErrors.length}
                  </h2>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="4">
              <IonCard>
                <IonCardContent>
                  <h2>PORCENTAGEM DE ERRO EM MEDICAÇÕES</h2>
                  {loading ? (
                    <div className="chart-loading">
                      <IonSpinner name="crescent" />
                      <p>Carregando dados de erros de medicação...</p>
                    </div>
                  ) : (
                    <MedicationErrorChart data={preparePieChartData()} />
                  )}
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="4" size-md="4">
              <IonCard>
                <IonCardContent>
                  <h2>ERROS EM ADMINISTRAÇÃO</h2>
                  {loading ? (
                    <div className="chart-loading">
                      <IonSpinner name="crescent" />
                      <p>Carregando dados de erros em administração...</p>
                    </div>
                  ) : (
                    <MedicationErrorBarChart
                      data={prepareBarChartData("ADMINISTRAÇÃO")}
                      color="#005450"
                    />
                  )}
                </IonCardContent>
              </IonCard>
            </IonCol>
            <IonCol size="6" size-md="4">
              <IonCard>
                <IonCardContent>
                  <h2>ERROS EM CONDUTA ÉTICA</h2>
                  {loading ? (
                    <div className="chart-loading">
                      <IonSpinner name="crescent" />
                      <p>Carregando dados de erros em conduta ética...</p>
                    </div>
                  ) : (
                    <MedicationErrorBarChart
                      data={prepareBarChartData("CONDUTA ÉTICA")}
                      color="#005450"
                    />
                  )}
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default MedicineDashboard;
