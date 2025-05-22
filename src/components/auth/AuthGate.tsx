import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useAuth } from '../../contexts/AuthContext';

const AuthGate: React.FC = () => {
  const {user, loading} = useAuth();
  const history = useHistory();
  const location = useLocation();
  const locationPath = location.pathname;

  // REDIRECTS FOR LOGGED IN USERS AND LOGGED OUT USERS
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if(!loading){
        if (user) {
          if(locationPath === '/welcome' || '/login' || '/signup'){
            history.push('/tabs');
          }
        }  else {
          history.push('/welcome');
        }
      }
    });

    return () => unsub();
  }, [user, loading, history]);

  return null;
};

export default AuthGate;