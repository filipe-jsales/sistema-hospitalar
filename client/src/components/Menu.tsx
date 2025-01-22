import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
} from '@ionic/react';
import { 
  homeOutline,
  logInOutline,
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
    title: 'Login',
    url: '/login',
    icon: logInOutline
  },
  {
    title: 'Register',
    url: '/register',
    icon: personAddOutline
  },
];

const Menu: React.FC = () => {
  const location = useLocation();
  
  return (
    <IonMenu contentId="main" type="overlay">
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