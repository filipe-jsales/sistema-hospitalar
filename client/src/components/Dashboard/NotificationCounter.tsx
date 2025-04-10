import React, { useEffect, useState } from 'react';
import { IonCard, IonCardContent, IonSpinner } from '@ionic/react';
import { useAppSelector } from '../../hooks/useRedux';

interface NotificationCounterProps {
  period: string;
}

const NotificationCounter: React.FC<NotificationCounterProps> = ({ period }) => {
  const { notifications, pagination, loading } = useAppSelector(
    (state) => state.notifications
  );
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (pagination) {
      let totalCount = pagination.totalItems;
      
      if (period !== 'Todos' && notifications.length > 0) {
        const now = new Date();
        let dateLimit = new Date();
        
        switch (period) {
          case 'Último mês':
            dateLimit.setMonth(now.getMonth() - 1);
            break;
          case 'Últimos 3 meses':
            dateLimit.setMonth(now.getMonth() - 3);
            break;
          case 'Últimos 6 meses':
            dateLimit.setMonth(now.getMonth() - 6);
            break;
          case 'Último ano':
            dateLimit.setFullYear(now.getFullYear() - 1);
            break;
        }
        
        if (period !== 'Todos') {
          const filteredCount = notifications.filter(notification => {
            const createdAt = notification.createdAt ? new Date(notification.createdAt) : null;
            return createdAt && createdAt >= dateLimit;
          }).length;
          
          const ratio = filteredCount / notifications.length;
          totalCount = Math.round(totalCount * ratio);
        }
      }
      
      setCount(totalCount);
    }
  }, [notifications, pagination, period]);

  return (
    <IonCard>
      <IonCardContent className="notification-counter">
        {loading ? (
          <IonSpinner name="crescent" />
        ) : (
          <>
            <h1>{count.toLocaleString()}</h1>
            <p>Notificações</p>
          </>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default NotificationCounter;