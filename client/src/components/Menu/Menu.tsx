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
} from "@ionic/react";
import { useLocation } from "react-router-dom";
import "./menu.css";
import { sideMenuPages } from "../../config/constants";

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
          <IonListHeader>Nome do Hospital</IonListHeader>
          {sideMenuPages.map((sideMenuPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem
                  className={
                    location.pathname === sideMenuPage.url ? "selected" : ""
                  }
                  routerLink={sideMenuPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon
                    aria-hidden="true"
                    slot="start"
                    icon={sideMenuPage.icon}
                  />
                  <IonLabel>{sideMenuPage.title}</IonLabel>
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
