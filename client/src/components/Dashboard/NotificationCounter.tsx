import React, { useEffect, useState } from "react";
import { IonCard, IonCardContent } from "@ionic/react";

interface NotificationCounterProps {
  period: string;
}

const NotificationCounter: React.FC<NotificationCounterProps> = ({
  period,
}) => {
  const [count, setCount] = useState<number>(7551);

  useEffect(() => {
    const mockCounts: Record<string, number> = {
      Todos: 7551,
      "Último mês": 623,
      "Últimos 3 meses": 1856,
      "Últimos 6 meses": 3720,
      "Último ano": 7551,
    };

    setCount(mockCounts[period] || 7551);
  }, [period]);

  return (
    <IonCard>
      <IonCardContent className="notification-counter">
        <h1>{count.toLocaleString()}</h1>
        <p>Notificações</p>
      </IonCardContent>
    </IonCard>
  );
};

export default NotificationCounter;
