import React, { useState } from "react";
import {
  IonButtons,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
} from "@ionic/react";
import { analytics, medkit, nutrition, person, bandage } from "ionicons/icons";
import { useHistory } from "react-router";

function Header() {
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const history = useHistory();

  const tabs = [
    { id: "home", label: "PAINEL DE GESTÃO À VISTA", icon: analytics },
    { id: "home", label: "INDICADORES", icon: analytics },
    { id: "medicine", label: "MEDICAMENTO", icon: medkit },
    { id: "home", label: "TERAPIA NUTRICIONAL", icon: nutrition },
    { id: "home", label: "IDENTIFICAÇÃO DO PACIENTE", icon: person },
    { id: "home", label: "LESÃO DE PELE", icon: bandage },
    { id: "home", label: "HIGIENIZAÇÃO DAS MÃOS", icon: bandage },
  ];

  const handleTabChange = (event: CustomEvent) => {
    const selectedValue = event.detail.value as string;
    setSelectedTab(selectedValue);
    history.push(`/${selectedValue}`);
  };

  return (
    <IonHeader>
      <IonToolbar>
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <IonTitle>Sistema Hospitalar</IonTitle>
      </IonToolbar>

      <IonSegment
        value={selectedTab}
        onIonChange={handleTabChange}
        scrollable={true}
        className="bg-light"
      >
        {tabs.map((tab) => (
          <IonSegmentButton key={tab.id} value={tab.id}>
            <IonLabel>{tab.label}</IonLabel>
            <IonIcon icon={tab.icon} />
          </IonSegmentButton>
        ))}
      </IonSegment>
    </IonHeader>
  );
}

export default Header;
