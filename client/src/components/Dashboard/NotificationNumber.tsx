import React, { useEffect, useState } from "react";
import { IonCard, IonCardContent } from "@ionic/react";

interface NotificationNumberProps {
  period: string;
}

const NotificationNumber: React.FC<NotificationNumberProps> = ({ period }) => {
  const [number, setNumber] = useState<number>(455084);

  useEffect(() => {
    const mockNumbers: Record<string, number> = {
      Todos: 455084,
      "Último mês": 455001,
      "Últimos 3 meses": 454823,
      "Últimos 6 meses": 453912,
      "Último ano": 455084,
    };

    setNumber(mockNumbers[period] || 455084);
  }, [period]);

  return (
    <IonCard>
      <IonCardContent className="notification-number">
        <div className="label">Nº NOTIFICAÇÃO VIGIHOSP</div>
        <h1>{number.toLocaleString()}</h1>
      </IonCardContent>
    </IonCard>
  );
};

export default NotificationNumber;
