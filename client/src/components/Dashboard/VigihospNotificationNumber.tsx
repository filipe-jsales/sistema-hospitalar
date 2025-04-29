import React from "react";
import { IonCard, IonCardContent, IonSpinner } from "@ionic/react";
import { useAppSelector } from "../../hooks/useRedux";

const VigihospNotificationNumber: React.FC = () => {
  const { notifications, loading } = useAppSelector(
    (state) => state.notifications
  );

  const vigihospNumber =
    notifications && notifications.length > 0 ? notifications[0].vigihosp : 0;

  return (
    <IonCard>
      <IonCardContent className="notification-number">
        {loading ? (
          <IonSpinner name="crescent" />
        ) : (
          <>
            <div className="label">Nº VIGIHOSP</div>
            <h1>{vigihospNumber.toLocaleString()}</h1>
          </>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default VigihospNotificationNumber;
