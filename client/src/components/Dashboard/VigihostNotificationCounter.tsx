import React, { useEffect, useState } from "react";
import { IonCard, IonCardContent } from "@ionic/react";
import { useAppSelector } from "../../hooks/useRedux";

interface NotificationNumberProps {
  period: string;
}

const DEFAULT_NOTIFICATION_NUMBER = 455084;

const VigihostNotificationCounter: React.FC<NotificationNumberProps> = ({ period }) => {
  const { notifications } = useAppSelector((state) => state.notifications);
  const [number, setNumber] = useState<number>(0);

  useEffect(() => {
    if (notifications && notifications.length > 0) {
      const lastNotification = notifications[0];

      if (lastNotification && lastNotification.notificationNumber) {
        const notificationNumber = parseInt(
          lastNotification.notificationNumber,
          10
        );
        if (!isNaN(notificationNumber)) {
          setNumber(notificationNumber);
          return;
        }
      }

      setNumber(DEFAULT_NOTIFICATION_NUMBER);
    } else {
      setNumber(455084);
    }
  }, [notifications, period]);

  return (
    <IonCard>
      <IonCardContent className="notification-number">
        <div className="label">Nº NOTIFICAÇÃO VIGIHOSP</div>
        <h1>{number.toLocaleString()}</h1>
      </IonCardContent>
    </IonCard>
  );
};

export default VigihostNotificationCounter;
