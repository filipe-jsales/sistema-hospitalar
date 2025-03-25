import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { 
  homeOutline,
  logOutOutline,
  medicalOutline,
  peopleCircleOutline,
  personAddOutline,
} from 'ionicons/icons';
import { useLocation } from 'react-router-dom';
import './menu.css';

interface AppPage {
  url: string;
  icon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Home',
    url: '/home',
    icon: homeOutline
  },
  {
    title: 'Cadastro de Usuário',
    url: '/users/create-user',
    icon: personAddOutline
  },
  {
    title: 'Listar Usuários',
    url: '/users',
    icon: peopleCircleOutline
  },
  {
    title: 'Listar Hospitais',
    url: '/hospitals',
    icon: medicalOutline
  },
  {
    title: 'Logout',
    url: '/login',
    icon: logOutOutline
  },
];

const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu side="start" contentId="main">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Menu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Navigation</IonListHeader>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem 
                  className={location.pathname === appPage.url ? 'selected' : ''}
                  routerLink={appPage.url} 
                  routerDirection="none" 
                  lines="none" 
                  detail={false}
                >
                  <IonIcon aria-hidden="true" slot="start" icon={appPage.icon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;