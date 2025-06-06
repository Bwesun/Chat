import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import { useAuth } from '../../contexts/AuthContext';

const AuthGate: React.FC = () => {
  const { user, loading } = useAuth();
  const history = useHistory();
  const location = useLocation();
  const locationPath = location.pathname;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!loading) {
        const guestRoutes = ['/welcome', '/login', '/register'];
        if (user) {
          if (guestRoutes.includes(locationPath)) {
            // console.log('User is authenticated, redirecting to messages');
            history.push('/messages');
          } 
        } else {
          if (!guestRoutes.includes(locationPath)) {
            // console.log('User is not authenticated, redirecting to welcome');
            history.push('/welcome');
          }
        }
      }
    });

    return () => unsub();
  }, [user, loading, history, locationPath]);

  return null;
};

export default AuthGate;