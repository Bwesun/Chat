import React, { useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { IonButton } from '@ionic/react';
import { InAppBrowser, DefaultWebViewOptions } from '@capacitor/inappbrowser';

const CurrentLocation: React.FC = () => {
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  const getCurrentLocation = async () => {
    try {
      const position = await Geolocation.getCurrentPosition();
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    } catch (error) {
      console.error('Error getting location', error);
    }
  };

  const openInMaps = async () => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
      await InAppBrowser.openInWebView({ url, options: DefaultWebViewOptions });
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      background: '#f5f7fa',
      borderRadius: '12px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
      padding: '2rem',
      maxWidth: '350px',
      margin: '2rem auto'
    }}>
      <button
        onClick={getCurrentLocation}
        style={{
          padding: '0.75rem 1.5rem',
          background: '#3880ff',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1rem',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          boxShadow: '0 1px 4px rgba(56,128,255,0.15)'
        }}
      >
        Get Current Location
      </button>
      {location && (
        <div style={{
          background: '#fff',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
          textAlign: 'center',
          color: '#000'
        }}>
          <p style={{ margin: '0.5rem 0', fontWeight: 500 }}>Latitude: {location.lat}</p>
          <p style={{ margin: '0.5rem 0', fontWeight: 500 }}>Longitude: {location.lng}</p>
          <IonButton expand="block" onClick={openInMaps} style={{ marginTop: '1rem' }}>
            View on Google Maps
          </IonButton>
        </div>
      )}
      <IonButton routerLink='/messages'>Home</IonButton>
    </div>
  );
};

export default CurrentLocation;