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
        if (user) {
          const guestRoutes = ['/welcome', '/login', '/register'];
          if (guestRoutes.includes(locationPath)) {
            history.push('/messages');
          }
        } else {
          history.push('/welcome');
        }
      }
    });

    return () => unsub();
  }, [user, loading, history, locationPath]);

  return null;
};

export default AuthGate;