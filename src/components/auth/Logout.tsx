import React, { useEffect } from "react";
import { useIonToast, IonContent, IonSpinner } from "@ionic/react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Logout: React.FC = () => {
  const history = useHistory();
  const [present] = useIonToast();
  const { user } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut(auth);

        present({
          message: "Signed out successfully!",
          duration: 1500,
          color: "success",
        });

        setTimeout(() => {
          history.replace("/welcome"); // Safe redirect
        }, 1500);
      } catch (error) {
        console.error("Logout Error:", error);
        present({
          message: "Error signing out!",
          duration: 2000,
          color: "danger",
        });
      }
    };

    handleLogout();
  }, [history, present]);

  return (
    <IonContent>
      <IonSpinner color={"tertiary"} name="bubbles" />
    </IonContent>
  );
};

export default Logout;