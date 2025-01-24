import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton /> 
          </IonButtons>
          <IonTitle>Sistema Hospitalar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent >
        <ExploreContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
