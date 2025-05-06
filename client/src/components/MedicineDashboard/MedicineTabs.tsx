import React from "react";

interface MedicineTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const MedicineTabs: React.FC<MedicineTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: "painel", label: "PAINEL DE GESTÃO À VISTA - USEP" },
    { id: "painel2", label: "PAINEL DE GESTÃO À VISTA" },
    { id: "indicadores", label: "INDICADORES" },
    { id: "medicamento", label: "MEDICAMENTO" },
    { id: "terapia", label: "TERAPIA NUTRICIONAL" },
    { id: "identificacao", label: "IDENTIFICAÇÃO DO PACIENTE" },
    { id: "lesao", label: "LESÃO DE PELE" },
    { id: "higienizacao", label: "HIGIENIZAÇÃO DAS MÃOS" },
  ];

  return (
    <div className="medicine-tabs-container">
      <div className="medicine-tabs-wrapper">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`medicine-tab-item ${
              activeTab === tab.id ? "active" : ""
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="medicine-tab-label">{tab.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicineTabs;
