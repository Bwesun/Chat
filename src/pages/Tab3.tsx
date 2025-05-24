import React from "react";
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
} from "@ionic/react";
import { LogOut, Edit, User, Mail, Phone, Settings, UserIcon } from "lucide-react";
import { arrowBackOutline, callOutline, filmOutline, mailOutline, personOutline } from "ionicons/icons";

const user = {
  name: "Jane Doe",
  email: "jane.doe@example.com",
  phone: "+1 555-123-4567",
  avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  bio: "Product Designer. Coffee lover. Dreamer.",
  stats: {
    friends: 120,
    messages: 342,
    groups: 8,
  },
};

const Profile: React.FC = () => (
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
          <IonTitle color={"light"} style={{ fontWeight: 500 }}>Profile</IonTitle>
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
          <img src={user.avatar} alt={user.name} style={{ objectFit: "cover", borderRadius: "50%" }} />
        </IonAvatar>
        <h2 style={{ fontWeight: 700, fontSize: 24, color: "#1E293B", margin: 0 }}>{user.name}</h2>
        <IonText color="medium" style={{ fontSize: 16 }}>{user.bio}</IonText>
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

      <IonList lines="none" style={{ background: "transparent"}}>
        <IonItem>
          <IonIcon icon={personOutline} slot="start" color="dark" />
          <IonLabel color={"dark"}>
            <strong>Name</strong>
            <div>{user.name}</div>
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

      {/* <div style={{
        display: "flex",
        justifyContent: "space-around",
        margin: "32px 0 24px 0",
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        padding: "16px 0",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: "#2563EB" }}>{user.stats.friends}</div>
          <IonText color="medium" style={{ fontSize: 14 }}>Friends</IonText>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: "#2563EB" }}>{user.stats.messages}</div>
          <IonText color="medium" style={{ fontSize: 14 }}>Messages</IonText>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: "#2563EB" }}>{user.stats.groups}</div>
          <IonText color="medium" style={{ fontSize: 14 }}>Groups</IonText>
        </div>
      </div> */}

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

export default Profile;