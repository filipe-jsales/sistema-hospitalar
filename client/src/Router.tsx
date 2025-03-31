import { Redirect, Route } from "react-router-dom";
import { IonReactRouter } from "@ionic/react-router";
import Menu from "./components/Menu/Menu";
import { IonRouterOutlet } from "@ionic/react";
import ActivateAccount from "./pages/auth/Activation";
import EditUser from "./pages/users/EditUser";
import HospitalsList from "./pages/hospitals/HospitalsList";
import EditHospital from "./pages/hospitals/EditHospital";
import Login from "./pages/auth/Login";
import Home from "./pages/home/Home";
import UsersList from "./pages/users/UsersList";
import CreateUser from "./pages/users/CreateUser";
import ResetPasswordRequest from "./pages/auth/ResetPassword";
import ResetPassword from "./pages/auth/ResetPasswordForm";

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
      {/* TODO: create the respective pages */}
      <Route exact path="/themes" component={HospitalsList} />
      <Route exact path="/notifications" component={HospitalsList} />
      <Route exact path="/incidents" component={HospitalsList} />
      <Route exact path="/organizational-unities" component={HospitalsList} />
      <Route exact path="/priorities" component={HospitalsList} />
      <Route exact path="/responsibles" component={HospitalsList} />
      <Route exact path="/categories" component={HospitalsList} />
      <Route exact path="/subcategories" component={HospitalsList} />
      <Route
        exact
        path="/users/reset-password/:token"
        component={ResetPassword}
      />
    </IonRouterOutlet>
  </IonReactRouter>
);

export default Router;
