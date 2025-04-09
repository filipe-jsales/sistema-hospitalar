import { IonContent, IonPage } from "@ionic/react";
import "./Home.css";
import Header from "../../components/Header/Header";
import Dashboard from "../dashboard/Dashboard";

const Home: React.FC = () => {
  return (
    <IonPage>
      <Header />
      <IonContent>
        <Dashboard />
      </IonContent>
    </IonPage>
  );
};

export default Home;
