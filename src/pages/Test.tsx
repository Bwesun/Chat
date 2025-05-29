import React, { useState } from 'react';
import { IonPage, IonButton, IonContent, IonImg, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';

const Test: React.FC = () => {
  const [photo, setPhoto] = useState<string | null>(null);

  const takePicture = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      // Save to filesystem
      const fileName = `photo_${Date.now()}.jpeg`;
      await Filesystem.writeFile({
        path: fileName,
        data: image.base64String!,
        directory: Directory.Data,
      });

      setPhoto(`data:image/jpeg;base64,${image.base64String}`);
      alert('Photo saved to device!');
    } catch (err) {
      alert('Failed to take photo: ' + err);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Take & Save Photo</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton onClick={takePicture}>Snap Picture</IonButton>
        {photo && (
          <IonImg src={photo} style={{ marginTop: 20, borderRadius: 8, maxWidth: 300 }} />
        )}
      </IonContent>
    </IonPage>
  );
};

export default Test;