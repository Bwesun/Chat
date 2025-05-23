import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

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
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import { Ellipsis, MessageSquarePlus, MessageSquareText, User } from 'lucide-react';
import AuthGate from './components/auth/AuthGate';
import Welcome from './pages/Welcome';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ChatPage from './pages/ChatPage';
import Contacts from './pages/Contacts';
import MessageList from './pages/MessageList';
import Profile from './pages/Tab3';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <AuthGate />
      <IonRouterOutlet>
        {/* Routes WITHOUT tabs */}
        <Route exact path="/welcome" component={Welcome} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/login" component={Login} />
        {/* <Route exact path="/chat" component={ChatPage} /> */}
        {/* If you have dynamic chat routes: */}
        <Route path="/chat/:id" component={ChatPage} />

        {/* Default redirect */}
        <Route exact path="/">
          <Redirect to="/welcome" />
        </Route>

        {/* Routes WITH tabs */}
        <Route path={["/tab1", "/tab2", "/tab3", "/contacts", "/messages", "/profile"]}>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/contacts">
                <Contacts />
              </Route>
              <Route exact path="/messages">
                <MessageList />
              </Route>
              <Route exact path="/tab1">
                <Tab1 />
              </Route>
              <Route exact path="/tab2">
                <Tab2 />
              </Route>
              <Route path="/profile">
                <Profile />
              </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="tab1" href="/tab1">
                <MessageSquareText />
                <IonLabel>Chats</IonLabel>
              </IonTabButton>
              <IonTabButton tab="tab2" href="/tab2">
                <MessageSquarePlus />
                <IonLabel>New Chat</IonLabel>
              </IonTabButton>
              <IonTabButton tab="profile" href="/profile">
                <User />
                <IonLabel>Profile</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
