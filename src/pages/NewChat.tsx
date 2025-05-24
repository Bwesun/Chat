import React, { useState } from 'react';
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
  IonBadge,
  IonFooter,
  IonButton,
  IonText,
  IonIcon,
  IonFab,
  IonFabButton,
  IonButtons,
} from '@ionic/react';
import { SearchIcon, PlusIcon, MessageSquarePlus, CheckIcon, XIcon } from 'lucide-react'; // Lucide icons remain
import { addOutline, arrowBackOutline, arrowForwardOutline, chevronForwardOutline } from 'ionicons/icons';

// Mock data (remains the same)
interface Contact {
  id: string;
  name: string;
  email: string;
  avatar: string;
  status: 'contact' | 'pending' | 'request';
}

const mockContacts: Contact[] = [
  { id: '1', name: 'Sarah Johnson', email: 'sarah.j@example.com', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', status: 'contact' },
  { id: '2', name: 'Michael Chen', email: 'michael.c@example.com', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', status: 'contact' },
  { id: '3', name: 'Jessica Williams', email: 'jessica.w@example.com', avatar: 'https://randomuser.me/api/portraits/women/63.jpg', status: 'contact' },
  { id: '4', name: 'Alex Rodriguez', email: 'alex.r@example.com', avatar: 'https://randomuser.me/api/portraits/men/4.jpg', status: 'pending' },
  { id: '5', name: 'Emma Wilson', email: 'emma.w@example.com', avatar: 'https://randomuser.me/api/portraits/women/22.jpg', status: 'request' },
];


const NewChat: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = mockContacts;
  
    // Helper function to render Lucide icons within IonIcon if needed, or directly
    const renderLucideIcon = (IconComponent: React.ElementType, size: number, className?: string, style?: React.CSSProperties) => {
      return <IconComponent size={size} className={className} style={style} />;
    };


  return (
    <IonPage>
      <IonHeader translucent={true} className="ion-no-border">
        <IonToolbar color={'light'}>
          <IonTitle color={'primary'}>Start New Chat</IonTitle>
          <IonButtons slot="start">
                      {/* Replicates Link to /home, hidden on md and up */}
                      <IonButton fill='clear' className="ion-hide-md-up" onClick={() => history.back()}>
                        <IonIcon color='primary' icon={arrowBackOutline} slot='icon-only' />
                      </IonButton>
                    </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSearchbar className='search-bar'
                    value={searchQuery}
                    color={'primary'}
                    onIonChange={(e) => setSearchQuery(e.detail.value!)}
                    placeholder="Search contact" 
                    style={{
                      '--placeholder-color': '--ion-color-light', 
                      '--box-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadow-sm
                      '--border-radius': '5rem', // rounded-lg
                    }}
                  >
                  </IonSearchbar>

          {filteredContacts.map((contact) => (
            <IonItem routerLink={`/chat/${contact.id}`} className='ion-no-border' lines='none' key={contact.id} button={true} detail={false} style={{ '--padding-start': '16px', '--inner-padding-end': '16px' }}>
              <IonAvatar slot="start" style={{ width: '48px', height: '48px' /* h-12 w-12 */ }}>
                <img src={contact.avatar} alt={`${contact.name}'s avatar`} style={{ objectFit: 'cover', borderRadius: '50%'}} />
              </IonAvatar>
              <IonLabel style={{ marginLeft: '16px' /* ml-4 */ }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <div>
                    <h2 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' /* gray-900 */ }}>
                      {contact.name}
                    </h2>
                    <p style={{ fontSize: '0.75rem', color: '#6B7280' /* gray-500 */ }}>
                      {contact.email}
                    </p>
                  </div>
                  
                    <IonButton
                      routerLink={`/chat/${contact.id}`}
                      size="small"
                      shape='round'
                      color={'primary'}
                      fill="outline" // or "outline"
                    >
                      <IonIcon icon={chevronForwardOutline} slot='icon-only' />
                    </IonButton>
                </div>
              </IonLabel>
            </IonItem>
          ))}
          {filteredContacts.length === 0 && (
            <IonItem lines="none">
              <IonLabel className="ion-text-center" style={{ color: '#6B7280', marginTop: '20px', marginBottom: '20px' }}>
                No contacts found.
              </IonLabel>
            </IonItem>
          )}
      </IonContent>
      <IonFooter>
      </IonFooter>
    </IonPage>
  );
};

export default NewChat;