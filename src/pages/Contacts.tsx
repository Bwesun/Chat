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
  IonText,
  IonSpinner,
} from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Contact {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const Contacts: React.FC = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    const fetchContacts = async () => {
      setLoading(true);
      try {
        // Fetch contacts from backend (excluding current user)
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/contacts/${user.uid}`);
        // If your backend returns firstname/surname, combine them for display
        const formatted = res.data.map((c: any) => ({
          id: c.id,
          name: c.name || `${c.firstname || ''} ${c.surname || ''}`.trim(),
          email: c.email,
        }));
        setContacts(formatted);
      } catch (error) {
        setContacts([]);
      }
      setLoading(false);
    };
    fetchContacts();
  }, [user?.uid]);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader translucent={true} className="ion-no-border">
        <IonToolbar color={'light'}>
          <IonTitle color={'primary'}>Contacts</IonTitle>
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
            <IonSpinner color={'primary'} name="crescent" style={{ width: 24, height: 24, marginRight: 8 }} />
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
              routerLink={`/viewprofile/${contact.id}`}
              className='ion-no-border'
              lines='none'
              key={contact.id}
              button={true}
              detail={false}
              style={{ '--padding-start': '16px', '--inner-padding-end': '16px' }}
            >
              <IonAvatar slot="start" style={{ width: '48px', height: '48px' }}>
                <img src={import.meta.env.VITE_AVATAR_URL || ''} alt={`${contact.name}'s avatar`} style={{ objectFit: 'cover', borderRadius: '50%' }} />
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
                    routerLink={`/viewprofile/${contact.id}`}
                    size="small"
                    shape='round'
                    color={'primary'}
                    fill="clear"
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

export default Contacts;