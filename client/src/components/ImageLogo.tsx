import { IonImg } from "@ionic/react";
import Logo from "../assets/asclepius.png"

export default function ImageLogo(){
  return(
    <div className="col-12 text-center">
      <IonImg src={Logo} alt="Logo_Asclepius" className="img-fluid"></IonImg>
    </div>
  );
}