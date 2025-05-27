import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonFooter,
  IonButton,
  IonIcon,
  IonButtons,
  IonText,
  IonSpinner,
} from '@ionic/react';
import { chevronForwardOutline, arrowBackOutline } from 'ionicons/icons';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface Contact {
  id: string;
  firstname: string;
  surname: string;
  name: string; // Combined name for display
  email: string;
  phone: string | null;

}

const NewChat: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    const fetchContacts = async () => {
      setLoading(true);
      try {
        // Fetch contacts from backend
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/contacts/${user.uid}`);
        setContacts(res.data);
      } catch (error) {
        // console.error('Error fetching contacts:', error);
        setContacts([]);
      }
      setLoading(false);
    };
    fetchContacts();
  }, [user?.uid]);

  const filteredContacts = contacts.filter(contact => {
    const search = searchQuery.trim().toLowerCase();
    return (
      contact.name.toLowerCase().includes(search) ||
      contact.email.toLowerCase().includes(search) ||
      (contact.phone && contact.phone.toLowerCase().includes(search))
    );
  });

  return (
    <IonPage>
      <IonHeader translucent={true} className="ion-no-border">
        <IonToolbar color={'light'}>
          <IonTitle color={'primary'}>Start New Chat</IonTitle>
          <IonButtons slot="start">
            <IonButton fill='clear' className="ion-hide-md-up" onClick={() => history.back()}>
              <IonIcon color='primary' icon={arrowBackOutline} slot='icon-only' />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSearchbar
          className='search-bar'
          value={searchQuery}
          color={'primary'}
          onIonInput={e => setSearchQuery(e.detail.value! ?? '')}
          placeholder="Search contact"
          style={{
            '--placeholder-color': '--ion-color-light',
            '--box-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            '--border-radius': '5rem',
          }}
        />

        {loading ? (
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <IonSpinner name="dots" style={{ width: 24, height: 24, marginRight: 8 }} />
            <IonText color="medium">Loading contacts...</IonText>
          </div>
        ) : filteredContacts.length === 0 ? (
          <IonItem lines="none">
            <IonLabel className="ion-text-center" style={{ color: '#6B7280', marginTop: '20px', marginBottom: '20px' }}>
              No contacts found.
            </IonLabel>
          </IonItem>
        ) : (
          filteredContacts.map((contact) => (
            <IonItem
              routerLink={`/chat/${contact.id}`}
              className='ion-no-border'
              lines='none'
              key={contact.id}
              button={true}
              detail={false}
              style={{ '--padding-start': '16px', '--inner-padding-end': '16px' }}
            >
              <IonAvatar slot="start" style={{ width: '48px', height: '48px' }}>
                <img src={import.meta.env.VITE_AVATAR_URL || ''} alt={`${contact.firstname} ${contact.surname}'s avatar`} style={{ objectFit: 'cover', borderRadius: '50%' }} />
              </IonAvatar>
              <IonLabel style={{ marginLeft: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div>
                    <h2 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' }}>
                      {contact.name}
                    </h2>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                      {contact.email}
                    </p>
                  </div>
                  <IonButton
                    routerLink={`/chat/${contact.id}`}
                    size="small"
                    shape='round'
                    color={'primary'}
                    fill="outline"
                  >
                    <IonIcon icon={chevronForwardOutline} slot='icon-only' />
                  </IonButton>
                </div>
              </IonLabel>
            </IonItem>
          ))
        )}
      </IonContent>
      <IonFooter />
    </IonPage>
  );
};

export default NewChat;