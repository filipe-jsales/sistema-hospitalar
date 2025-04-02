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
import IncidentsList from "./pages/incidents/IncidentsList";
import EditIncident from "./pages/incidents/EditIncident";
import ThemesList from "./pages/themes/ThemesList";
import NotificationsList from "./pages/notifications/NotificationsList";
import OrganizationalUnitiesList from "./pages/organizational-unities/OrganizationalUnitiesList";
import PrioritiesList from "./pages/priorities/PrioritiesList";
import ResponsiblesList from "./pages/responsibles/ResponsiblesList";
import CategoriesList from "./pages/categories/CategoriesList";
import SubcategoriesList from "./pages/subcategories/SubcategoriesList";
import EditTheme from "./pages/themes/EditTheme";
import EditNotification from "./pages/notifications/EditNotification";
import EditOrganizationalUnity from "./pages/organizational-unities/EditOrganizationalUnity";
import EditPriority from "./pages/priorities/EditPriority";
import EditResponsible from "./pages/responsibles/EditResponsible";
import EditCategory from "./pages/categories/EditCategory";
import EditSubcategory from "./pages/subcategories/EditSubcategory";

const Router: React.FC = () => (
  <IonReactRouter>
    <Menu />
    <IonRouterOutlet id="main">
      <Route exact path="/">
        <Redirect to="/login" />
      </Route>
      <Route exact path="/login" component={Login} />
      <Route exact path="/home" component={Home} />
      <Route exact path="/redefinition" component={ResetPasswordRequest} />
      {/* TODO: the correct should this be part of /auth route */}
      <Route
        exact
        path="/users/reset-password/:token"
        component={ResetPassword}
      />

      <Route exact path="/users" component={UsersList} />
      <Route exact path="/users/edit/:id" component={EditUser} />
      <Route exact path="/users/create-user" component={CreateUser} />
      <Route path="/users/activate/:token" component={ActivateAccount} />

      <Route exact path="/hospitals" component={HospitalsList} />
      <Route exact path="/hospitals/edit/:id" component={EditHospital} />

      <Route exact path="/themes" component={ThemesList} />
      <Route exact path="/themes/edit/:id" component={EditTheme} />

      <Route exact path="/notifications" component={NotificationsList} />
      <Route
        exact
        path="/notifications/edit/:id"
        component={EditNotification}
      />

      <Route exact path="/incidents" component={IncidentsList} />
      <Route exact path="/incidents/edit/:id" component={EditIncident} />
      <Route
        exact
        path="/organizational-unities"
        component={OrganizationalUnitiesList}
      />
      <Route
        exact
        path="/organizational-unities/edit/:id"
        component={EditOrganizationalUnity}
      />

      <Route exact path="/priorities" component={PrioritiesList} />
      <Route exact path="/priorities/edit/:id" component={EditPriority} />

      <Route exact path="/responsibles" component={ResponsiblesList} />
      <Route exact path="/responsibles/edit/:id" component={EditResponsible} />

      <Route exact path="/categories" component={CategoriesList} />
      <Route exact path="/categories/edit/:id" component={EditCategory} />

      <Route exact path="/subcategories" component={SubcategoriesList} />
      <Route exact path="/subcategories/edit/:id" component={EditSubcategory} />

    </IonRouterOutlet>
  </IonReactRouter>
);

export default Router;
