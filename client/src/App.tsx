import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
// import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import Login from './pages/Login';
import Register from './pages/Register';
import ActivateAccount from './pages/Activation';
import ResetPasswordRequest from './pages/ResetPassword';
import ResetPassword from './pages/ResetPasswordForm';
import Menu from './components/Menu';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
        <Menu />
        <IonRouterOutlet id="main">
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
          <Route exact path="/login" component={Login} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route path="/users/activate/:token" component={ActivateAccount} />
          <Route exact path="/redefinition" component={ResetPasswordRequest} />
          <Route exact path="/users/reset-password/:token" component={ResetPassword} />
        </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
