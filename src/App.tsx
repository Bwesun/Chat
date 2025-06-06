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
import { StatusBar } from '@capacitor/status-bar';

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
import { Ellipsis, LocateIcon, MessageSquarePlus, MessageSquareText, User, Users } from 'lucide-react';
import AuthGate from './components/auth/AuthGate';
import Welcome from './pages/Welcome';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ChatPage from './pages/ChatPage';
import Contacts from './pages/Contacts';
import MessageList from './pages/MessageList';
import Profile from './pages/Profile';
import NewChat from './pages/NewChat';
import ViewProfile from './pages/ViewProfile';
import { useEffect } from 'react';
import Logout from './components/auth/Logout';
import NetworkCheck from './components/NetworkCheck';
import { AuthProvider } from './contexts/AuthContext';
import CurrentLocation from './components/CurrentLocation';

setupIonicReact();

const App: React.FC = () => {
  useEffect(() => {
    const setStatusBar = async () => {
      try {
        await StatusBar.setBackgroundColor({ color: '#6200a8' }); // Your color here
        await StatusBar.setOverlaysWebView({ overlay: false }); // Avoid overlapping
      } catch (error) {
        console.error('Error setting status bar:', error);
      }
    };

    setStatusBar();
  }, []);

  return (
    <AuthProvider>

  <IonApp>
    <IonReactRouter>
      <AuthGate />
      <NetworkCheck />
        {/* Routes WITHOUT tabs */}
        <Route exact path="/welcome" component={Welcome} />

        <Route exact path="/register" component={Register} />

        <Route exact path="/login" component={Login} />

        <Route exact path="/location" component={CurrentLocation} />

        <Route exact path="/logout" component={Logout} />

        <Route exact path="/newchat" component={NewChat}/>

        {/* If you have dynamic chat routes: */}
        <Route path="/chat/:id" component={ChatPage} />

        {/* Default redirect */} 
        <Route exact path="/">
          <Redirect to="/welcome" />
        </Route>

        {/* Routes WITH tabs */}
        <Route path={["/contacts", "/messages", "/profile", "/viewprofile/:id"]}>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/contacts">
                <Contacts />
              </Route>
              <Route exact path="/messages">
                <MessageList />
              </Route>
              <Route path="/profile">
                <Profile />
              </Route>
              <Route exact path="/viewprofile/:id">
                <ViewProfile />
              </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="messages" href="/messages">
                <MessageSquareText />
                <IonLabel>Chats</IonLabel>
              </IonTabButton>
              <IonTabButton tab="contacts" href="/contacts">
                <Users />
                <IonLabel>Contacts</IonLabel>
              </IonTabButton>
              <IonTabButton tab="profile" href="/profile">
                <User />
                <IonLabel>Profile</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </Route>
    </IonReactRouter>
  </IonApp>
    </AuthProvider>
)};

export default App;
