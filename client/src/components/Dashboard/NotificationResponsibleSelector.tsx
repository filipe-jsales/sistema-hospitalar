import React from "react";
import {
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonSpinner,
} from "@ionic/react";
import { useAppSelector } from "../../hooks/useRedux";

interface ResponsibleSelectorProps {
  selectedResponsibleId: number | null;
  onResponsibleChange: (responsibleId: number | null) => void;
}

const NotificationResponsibleSelector: React.FC<ResponsibleSelectorProps> = ({
  selectedResponsibleId,
  onResponsibleChange,
}) => {
  const { notifications, loading } = useAppSelector(
    (state) => state.notifications
  );

  const uniqueResponsibles = React.useMemo(() => {
    if (!notifications?.length) return [];

    const responsiblesMap = new Map();

    notifications.forEach((notification) => {
      if (
        notification.responsible &&
        notification.responsible.id &&
        notification.responsible.name
      ) {
        responsiblesMap.set(
          notification.responsible.id,
          notification.responsible
        );
      }
    });

    return Array.from(responsiblesMap.values()).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }, [notifications]);

  const handleResponsibleSelection = (id: number) => {
    if (selectedResponsibleId === id) {
      onResponsibleChange(null);
    } else {
      onResponsibleChange(id);
    }
  };

  const handleAllSelection = () => {
    onResponsibleChange(null);
  };

  if (loading) {
    return (
      <div className="ion-text-center">
        <IonSpinner name="crescent" />
        <p>Carregando responsáveis...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="fw-bold mb-2 text-center">RESPONSÁVEL</div>

      <IonList
        style={{ maxHeight: "200px", overflowY: "auto" }}
        className="ion-no-padding ion-no-margin"
      >
        <IonItem lines="full" className="p-0">
          <IonCheckbox
            checked={selectedResponsibleId === null}
            onIonChange={handleAllSelection}
            className="me-2"
            style={{ "--border-radius": "4px", "--size": "18px" }}
          />
          <IonLabel className="ps-2">Todos</IonLabel>
        </IonItem>

        {uniqueResponsibles.map((responsible) => (
          <IonItem key={responsible.id} lines="full" className="p-0">
            <IonCheckbox
              checked={selectedResponsibleId === responsible.id}
              onIonChange={() => handleResponsibleSelection(responsible.id)}
              className="me-2"
              style={{ "--border-radius": "4px", "--size": "18px" }}
            />
            <IonLabel className="ps-2">{responsible.name}</IonLabel>
          </IonItem>
        ))}
      </IonList>
    </div>
  );
};

export default NotificationResponsibleSelector;
