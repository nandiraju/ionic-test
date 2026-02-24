import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Dashboard from './pages/Dashboard';
import BookletDetail from './pages/BookletDetail';
import Home from './pages/Home';
import Profile from './pages/Profile';
import { BookletProvider } from './contexts/BookletContext';
import { UserProvider } from './contexts/UserContext';

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
import '@ionic/react/css/palettes/dark.class.css';
/* import '@ionic/react/css/palettes/dark.system.css'; */

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <UserProvider>
      <BookletProvider>
        <IonReactRouter basename="/ionic-test">
          <IonRouterOutlet>
            <Route exact path="/home" component={Home} />
            <Route exact path="/dashboard" component={Dashboard} />
            <Route exact path="/booklet/:id" component={BookletDetail} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
            <Route>
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </BookletProvider>
    </UserProvider>
  </IonApp>
);

export default App;
