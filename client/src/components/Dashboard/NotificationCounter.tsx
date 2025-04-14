import React from 'react';
import { IonCard, IonCardContent, IonSpinner } from '@ionic/react';
import { useAppSelector } from '../../hooks/useRedux';

const NotificationCounter: React.FC = () => {
  const { pagination, loading } = useAppSelector(
    (state) => state.notifications
  );

  return (
    <IonCard>
      <IonCardContent className="notification-counter">
        {loading ? (
          <IonSpinner name="crescent" />
        ) : (
          <>
            <h1>{pagination ? pagination.totalItems.toLocaleString() : 0}</h1>
            <p>Notificações</p>
          </>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default NotificationCounter;