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
  IonModal,
  IonImg,
  IonInput,
} from "@ionic/react";
import { LogOut, Edit, User, Mail, Phone, Settings } from "lucide-react";
import { arrowBackOutline, callOutline, mailOutline, personOutline, cameraOutline, closeOutline } from "ionicons/icons";
import { useAuth } from "../contexts/AuthContext";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { Filesystem, Directory } from '@capacitor/filesystem';
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";


const Profile: React.FC = () => {
  const { user } = useAuth();
  const [photo, setPhoto] = useState<string | null>(null);
  const [currentPhoto, setCurrentPhoto] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // <-- Add this
  const [photoAlert, setPhotoAlert ] = useState<string | null>(null);
  const history = useHistory();

  // Add react-hook-form for edit modal
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      bio: ""
    }
  });

  useEffect(() => {
    if (!user?.uid) return;
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/${user.uid}`);
        setProfile(res.data);
        // Set form defaults
        reset({
          name: res.data.name || `${res.data.firstname} ${res.data.surname}`,
          email: res.data.email,
          phone: res.data.phone,
          bio: res.data.bio || ""
        });
      } catch (error) {
        setProfile(null);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user?.uid, reset]);

  useEffect(() => {
    if (user?.uid) return;

    const loadPhoto = async () => {
      const fileName = `photo_${user?.uid}.jpeg`;
      try {
        const file = await Filesystem.readFile({
          path: fileName,
          directory: Directory.Data,
        });
        setCurrentPhoto(`data:image/jpeg;base64,${file.data}`);
      } catch (err) {
        setPhotoAlert('Failed to load photo!');
      }
    };


    loadPhoto();
  }, [user?.uid]);

  const handleEditPhoto = () => {
    setShowModal(true);
  };

    // Take Picture and save
  const takePicture = async () => {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Base64,
        });
  
        // Save to filesystem
        const fileName = `photo_${user?.uid}.jpeg`;
        await Filesystem.writeFile({
          path: fileName,
          data: image.base64String!,
          directory: Directory.Data,
        });
  
        setPhoto(`data:image/jpeg;base64,${image.base64String}`);
        setCurrentPhoto(`data:image/jpeg;base64,${image.base64String}`);
        // alert('Photo saved to device!');
        history.push('/profile')
      } catch (err) {
        alert('Failed to take photo: ' + err);
      }
    };

  // Edit profile submit handler
  const onEditProfile = async (data: any) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user/${user?.uid}`, data);
      setProfile((prev: any) => ({ ...prev, ...data }));
      setShowEditModal(false);
    } catch (err) {
      alert("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle color={"light"}>Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div style={{ textAlign: "center", marginTop: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IonText color="medium">
              <IonSpinner color={'primary'} name="crescent" style={{ width: 24, height: 24, marginRight: 8 }}></IonSpinner>
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
            <IonButton fill='clear' className="ion-hide-md-up" onClick={() => window.history.back()}>
              <IonIcon color="light" icon={arrowBackOutline} slot='icon-only' />
            </IonButton>
          </IonButtons>
          <IonTitle color={"light"} style={{ fontWeight: 500 }}>
            {profile.firstname + ' ' + profile.surname} (You)
          </IonTitle>
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
          <div style={{ position: "relative", width: 96, height: 96, marginBottom: 16 }}>
            <IonAvatar style={{ width: 96, height: 96 }}>
              <img
                src={currentPhoto || import.meta.env.VITE_AVATAR_URL}
                alt={profile.firstname + profile.surname || profile.firstname}
                style={{ objectFit: "cover", borderRadius: "50%", width: "100%", height: "100%" }}
              />
            </IonAvatar>
            {/* Edit icon overlay */}
            <IonButton
              fill="clear"
              size="small"
              onClick={handleEditPhoto}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                background: "#fff",
                border: "none",
                borderRadius: "50%",
                boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                width: 32,
                height: 32, 
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
              }}
              aria-label="Edit profile photo"
            >
              <IonIcon color="primary" slot="icon-only" size="small" icon={cameraOutline} />
            </IonButton>
          </div>
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
            onClick={() => setShowEditModal(true)} // <-- Open edit modal
          >
            <Edit size={16} style={{ marginRight: 8 }} />
            Edit Profile
          </IonButton>
        </div>

        {/* Modal for editing profile photo */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle color={"light"}>Edit Profile Photo</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}><IonIcon color="light" icon={closeOutline} slot={'icon-only'}/></IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <div style={{
              display: "flex", justifyContent: 'center', alignItems: 'center', flexDirection: 'column'
            }}>
                {photo && (
                  <IonAvatar style={{ width: '15rem', height: '15rem' }}>
                      <img
                        src={photo}
                        alt={profile.firstname + profile.surname || profile.firstname}
                        style={{ objectFit: "cover", borderRadius: "50%", width: "100%", height: "100%" }}
              />
            </IonAvatar>
                    ) || (
                      <IonAvatar style={{ width: '15rem', height: '15rem' }}>
                      <img
                        src={import.meta.env.VITE_AVATAR_URL}
                        alt={profile.firstname + profile.surname || profile.firstname}
                        style={{ objectFit: "cover", borderRadius: "50%", width: "100%", height: "100%" }}
              />
            </IonAvatar>
                    )}
                    <IonButton shape="round" onClick={takePicture}> <IonIcon icon={cameraOutline} slot="start" /> Change Picture</IonButton>
            </div>
          </IonContent>
        </IonModal>

        {/* Modal for editing profile details */}
        <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Edit Profile</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowEditModal(false)}>
                  <IonIcon icon={closeOutline} />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <form onSubmit={handleSubmit(onEditProfile)}>
              <IonList>
                <IonItem>
                  <IonLabel position="stacked">Name</IonLabel>
                  <IonInput
                    {...register("name", { required: true })}
                    defaultValue={profile.name || `${profile.firstname} ${profile.surname}`}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Email</IonLabel>
                  <IonInput
                    type="email"
                    {...register("email", { required: true })}
                    defaultValue={profile.email}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Phone</IonLabel>
                  <IonInput
                    {...register("phone")}
                    defaultValue={profile.phone}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Bio</IonLabel>
                  <IonInput
                    {...register("bio")}
                    defaultValue={profile.bio}
                  />
                </IonItem>
              </IonList>
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                <IonButton
                  type="button"
                  color="medium"
                  onClick={() => setShowEditModal(false)}
                  style={{ marginRight: 8 }}
                >
                  Cancel
                </IonButton>
                <IonButton type="submit" color="primary" disabled={isSubmitting}>
                  {isSubmitting ? <IonSpinner name="dots" /> : "Save"}
                </IonButton>
              </div>
            </form>
          </IonContent>
        </IonModal>

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