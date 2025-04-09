import React, { useEffect, useState } from "react";
import { IonItem, IonLabel, IonList } from "@ionic/react";

interface IncidentDescriptionTableProps {
  period: string;
}

interface IncidentDescription {
  description: string;
}

const IncidentDescriptionTable: React.FC<IncidentDescriptionTableProps> = ({
  period,
}) => {
  const [incidents, setIncidents] = useState<IncidentDescription[]>([]);

  useEffect(() => {
    const mockIncidents: IncidentDescription[] = [
      {
        description:
          "AGÊNCIA TRANSFUSIONAL SE RECUSOU A LIBERAR O SANGUE PARA TRANSFUSÃO MACIÇA",
      },
      {
        description:
          "BANDAGEM ELÁSTICA ADESIVA COM MÁ ADERÊNCIA E DESFIANDO À MANIPULAÇÃO",
      },
      { description: "CATETER DUPLO LUMEN - MEDIKATH" },
      { description: "DIFICULDADE GRANDE EM COMUNICAR NO SETOR DA TOMOGRAFIA" },
      {
        description:
          "EPI - DESCARTE INADEQUADO DE AVENTAL PB, DANIFICADO EQUIPAMENTO DE PROTEÇÃO",
      },
      { description: "EQUIPE ANESTÉSICA" },
      {
        description: "FALHA ADMINISTRAÇÃO DE QUIMIOTERÁPICO COM PERDA DE DOSES",
      },
    ];

    setIncidents(mockIncidents);
  }, [period]);

  return (
    <IonList className="incident-table">
      {incidents.map((incident, index) => (
        <IonItem
          key={index}
          className={index % 2 === 0 ? "even-row" : "odd-row"}
        >
          <IonLabel className="ion-text-wrap">{incident.description}</IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
};

export default IncidentDescriptionTable;
