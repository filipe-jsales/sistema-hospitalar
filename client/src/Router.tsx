import { Redirect, Route } from "react-router-dom";
import { IonReactRouter } from "@ionic/react-router";
import Menu from "./components/Menu/Menu";
import { IonRouterOutlet } from "@ionic/react";
import Login from "./pages/Login";
import Home from "./pages/Home";
import CreateUser from "./pages/CreateUser";
import ActivateAccount from "./pages/Activation";
import ResetPasswordRequest from "./pages/ResetPassword";
import ResetPassword from "./pages/ResetPasswordForm";
import EditUser from "./pages/users/EditUser";
import HospitalsList from "./pages/hospitals/HospitalsList";
import UsersList from "./pages/UsersList";
import EditHospital from "./pages/hospitals/EditHospital";

const Router: React.FC = () => (
  <IonReactRouter>
    <Menu />
    <IonRouterOutlet id="main">
      <Route exact path="/">
        <Redirect to="/login" />
      </Route>
      <Route exact path="/login" component={Login} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/users" component={UsersList} />
      <Route exact path="/users/edit/:id" component={EditUser} />
      <Route exact path="/users/create-user" component={CreateUser} />
      <Route path="/users/activate/:token" component={ActivateAccount} />
      <Route exact path="/hospitals" component={HospitalsList} />
      <Route exact path="/hospital/edit/:id" component={EditHospital} />
      <Route exact path="/redefinition" component={ResetPasswordRequest} />
      <Route
        exact
        path="/users/reset-password/:token"
        component={ResetPassword}
      />
    </IonRouterOutlet>
  </IonReactRouter>
);

export default Router;
