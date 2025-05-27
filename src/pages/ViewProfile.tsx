import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonAvatar,
  IonButton,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonButtons,
  IonSpinner,
} from "@ionic/react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MessageCircle } from "lucide-react";
import { arrowBackOutline, callOutline, mailOutline, personOutline } from "ionicons/icons";

const ViewProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/${id}`);
        setUser(res.data);
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    };
    fetchUser();
  }, [id]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton fill='clear'
              onClick={() => window.history.back()}
              className="ion-hide-md-up">
              <IonIcon icon={arrowBackOutline} slot='icon-only' />
            </IonButton>
          </IonButtons>
          <IonTitle color={"light"} style={{ fontWeight: 500 }}>{user?.firstname + ' ' + user?.surname || ''} Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ "--background": "#F9FAFB" }}>
        {loading ? (
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <IonSpinner name="dots" style={{ width: 24, height: 24, marginRight: 8 }} />
            <IonText color="medium">Loading profile...</IonText>
          </div>
        ) : !user ? (
          <IonText color="danger">User not found.</IonText>
        ) : (
          <>
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: 32,
              marginBottom: 24,
            }}>
              <IonAvatar style={{ width: 96, height: 96, marginBottom: 16 }}>
                <img src={import.meta.env.VITE_AVATAR_URL || ''} alt={user.firstname + ' ' + user.surname} style={{ objectFit: "cover", borderRadius: "50%" }} />
              </IonAvatar>
              <h2 style={{ fontWeight: 700, fontSize: 24, color: "#1E293B", margin: 0 }}>
                {user.name || `${user.firstname} ${user.surname}`}
              </h2>
              <IonText color="medium" style={{ fontSize: 16 }}>{user.bio}</IonText>
            </div>

            <IonList lines="none" style={{ background: "transparent" }}>
              <IonItem>
                <IonIcon icon={personOutline} slot="start" color="dark" />
                <IonLabel color={"dark"}>
                  <strong>Name</strong>
                  <div>{user.name || `${user.firstname} ${user.surname}`}</div>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon color="dark" icon={mailOutline} slot="start" />
                <IonLabel color={"dark"}>
                  <strong>Email</strong>
                  <div>{user.email}</div>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonIcon color={"dark"} icon={callOutline} slot="start" />
                <IonLabel color={"dark"}>
                  <strong>Phone</strong>
                  <div>{user.phone}</div>
                </IonLabel>
              </IonItem>
            </IonList>

            <IonButton
              expand="block"
              color="primary"
              style={{
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 16,
                marginBottom: 12,
              }}
              routerLink={`/chat/${user.id}`}
            >
              <MessageCircle size={18} style={{ marginRight: 8 }} />
              Start Chat
            </IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ViewProfile;