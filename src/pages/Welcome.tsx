import React from "react";
import { IonPage, IonContent, IonButton } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { MessageSquareText, UserPlus } from "lucide-react";

const Welcome: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent
        fullscreen
        className="ion-padding"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: 40,
            width: "100%",
            textAlign: "center",
            minHeight: '80vh',
            gap: '2rem'
          }}
        >
          <div style={{ marginBottom: 24 }}>
            <MessageSquareText size={48} color="#6366f1" />
            <h1
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: "#3730a3",
                margin: "16px 0 8px 0",
              }}
            >
              Welcome to Censono Chat
            </h1>
            <p style={{ color: "#6d7280", fontSize: 16 }}>
              Connect, chat, and collaborate instantly.
            </p>
          </div>
          <div>
            <IonButton
            expand="block"
            color="primary"
            style={{
              fontWeight: 600,
              fontSize: 16,
              marginBottom: 16,
              borderRadius: 12,
            }}
            onClick={() => history.push("/login")}
          >
            <MessageSquareText size={18} style={{ marginRight: 8 }} />
            Login
          </IonButton>
          <IonButton
            expand="block"
            fill="outline"
            color="primary"
            style={{
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 12,
            }}
            onClick={() => history.push("/register")}
          >
            <UserPlus size={18} style={{ marginRight: 8 }} />
            Create Account
          </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Welcome;