import React, { useEffect, useState } from "react";
import axios from "axios";
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
import { LogOut, Edit, User, Mail, Phone, Settings, UserIcon } from "lucide-react";
import { arrowBackOutline, callOutline, filmOutline, mailOutline, personOutline } from "ionicons/icons";
import { useAuth } from "../contexts/AuthContext";

const Profile: React.FC = () => {
  const { user } = useAuth(); // Make sure your auth context provides user.uid
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/${user.uid}`);
        setProfile(res.data);
      } catch (error) {
        setProfile(null);
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user?.uid]);

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <IonText color="medium">
              <IonSpinner name="dots" style={{ width: 24, height: 24, marginRight: 8 }}></IonSpinner>
              Loading profile...
            </IonText>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!profile) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonText color="danger">Profile not found.</IonText>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton fill='clear' className="ion-hide-md-up" onClick={() => history.back()}>
              <IonIcon color="light" icon={arrowBackOutline} slot='icon-only' />
            </IonButton>
          </IonButtons>
          <IonTitle color={"light"} style={{ fontWeight: 500 }}>{profile.firstname + ' ' + profile.surname} (You)</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ "--background": "#F9FAFB" }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 32,
          marginBottom: 24,
        }}>
          <IonAvatar style={{ width: 96, height: 96, marginBottom: 16 }}>
            <img src={import.meta.env.VITE_AVATAR_URL} alt={profile.firstname + profile.surname || profile.firstname} style={{ objectFit: "cover", borderRadius: "50%" }} />
          </IonAvatar>
          <h2 style={{ fontWeight: 700, fontSize: 24, color: "#1E293B", margin: 0 }}>
            {profile.name || `${profile.firstname} ${profile.surname}`}
          </h2>
          <IonText color="medium" style={{ fontSize: 16 }}>{profile.bio}</IonText>
          <IonButton
            fill="outline"
            size="small"
            style={{
              marginTop: 16,
              borderRadius: 12,
              fontWeight: 500,
              textTransform: "none",
              fontSize: 14,
            }}
          >
            <Edit size={16} style={{ marginRight: 8 }} />
            Edit Profile
          </IonButton>
        </div>

        <IonList lines="none" style={{ background: "transparent" }}>
          <IonItem>
            <IonIcon icon={personOutline} slot="start" color="dark" />
            <IonLabel color={"dark"}>
              <strong>Name</strong>
              <div>{profile.name || `${profile.firstname} ${profile.surname}`}</div>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon color="dark" icon={mailOutline} slot="start" />
            <IonLabel color={"dark"}>
              <strong>Email</strong>
              <div>{profile.email}</div>
            </IonLabel>
          </IonItem>
          <IonItem>
            <IonIcon color={"dark"} icon={callOutline} slot="start" />
            <IonLabel color={"dark"}>
              <strong>Phone</strong>
              <div>{profile.phone}</div>
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
        >
          <Settings size={18} style={{ marginRight: 8 }} />
          Account Settings
        </IonButton>
        <IonButton
          expand="block"
          color="danger"
          fill="outline"
          routerLink="/logout"
          style={{
            borderRadius: 12,
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          <LogOut size={18} style={{ marginRight: 8 }} />
          Log Out
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Profile;