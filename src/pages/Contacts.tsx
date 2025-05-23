import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonButton,
  IonIcon,
  IonFooter,
  IonText,
} from '@ionic/react';
import {
  SearchIcon,
  PlusIcon, // Not used in original, but kept from original imports
  UserPlusIcon,
  CheckIcon,
  XIcon,
} from 'lucide-react'; // Lucide icons remain

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

const Contacts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'requests' | 'pending'>('all');

  const filteredContacts = mockContacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'all') return true;
    if (activeTab === 'requests') return contact.status === 'request';
    if (activeTab === 'pending') return contact.status === 'pending';
    return true; // Should not happen with defined activeTab types
  });

  // Helper function to render Lucide icons within IonIcon if needed, or directly
  const renderLucideIcon = (IconComponent: React.ElementType, size: number, className?: string, style?: React.CSSProperties) => {
    return <IconComponent size={size} className={className} style={style} />;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ fontWeight: 600, color: '#374151' /* gray-800 */ }}>Contacts</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonSearchbar
            value={searchQuery}
            onIonChange={(e) => setSearchQuery(e.detail.value!)}
            placeholder="Search contacts"
            style={{
              '--border-radius': '0.5rem', /* rounded-lg */
              '--box-shadow': 'none', // Remove default shadow if not desired
              // For border color, it's a bit tricky, might need custom CSS for precise match
              // '--border-color': '#D1D5DB', // gray-300 - this doesn't work directly for the outer border
              paddingBottom: '8px', // To give some space before segments
            }}
          >
            {/* IonSearchbar has its own search icon, but if you want Lucide: */}
            {/* <div slot="start" style={{ display: 'flex', alignItems: 'center', paddingLeft: '8px' }}>
              {renderLucideIcon(SearchIcon, 18, 'text-gray-400')}
            </div> */}
          </IonSearchbar>
        </IonToolbar>
        <IonToolbar>
          <IonSegment
            value={activeTab}
            onIonChange={(e) => setActiveTab(e.detail.value as 'all' | 'requests' | 'pending')}
            style={{ '--background': '#fff' /* Ensure white background for segment container */ }}
          >
            <IonSegmentButton value="all">
              <IonLabel style={{ fontSize: '0.875rem', textTransform: 'none' }}>All Contacts</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="requests">
              <IonLabel style={{ fontSize: '0.875rem', textTransform: 'none' }}>Friend Requests</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="pending">
              <IonLabel style={{ fontSize: '0.875rem', textTransform: 'none' }}>Pending</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonList lines="full" style={{ paddingTop: 0 }}> {/* lines="full" for divide-y */}
          {filteredContacts.map((contact) => (
            <IonItem key={contact.id} button={true} detail={false} style={{ '--padding-start': '16px', '--inner-padding-end': '16px' }}>
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
                  
                  {contact.status === 'contact' && (
                    <IonButton
                      routerLink={`/chat/${contact.id}`}
                      size="small"
                      fill="solid" // or "outline"
                      style={{
                        '--background': '#EFF6FF', /* bg-blue-50 */
                        '--background-hover': '#DBEAFE', /* hover:bg-blue-100 */
                        '--color': '#2563EB', /* text-blue-600 */
                        '--border-radius': '0.375rem', /* rounded-md */
                        '--padding-start': '0.75rem', /* px-3 */
                        '--padding-end': '0.75rem',
                        '--padding-top': '0.25rem', /* py-1 */
                        '--padding-bottom': '0.25rem',
                        fontSize: '0.75rem', /* text-xs */
                        fontWeight: 500, /* font-medium */
                        textTransform: 'none',
                        height: 'auto', // to respect padding
                        boxShadow: 'none',
                      }}
                    >
                      Message
                    </IonButton>
                  )}
                  {contact.status === 'request' && (
                    <div style={{ display: 'flex', gap: '0.5rem' /* space-x-2 */ }}>
                      <IonButton
                        size="small"
                        shape="round"
                        style={{
                          '--background': '#2563EB', /* bg-blue-500 */
                          '--background-hover': '#1D4ED8', /* hover:bg-blue-600 */
                          '--color': 'white',
                          '--padding-start': '0', // Adjust to center icon
                          '--padding-end': '0',
                          '--padding-top': '0',
                          '--padding-bottom': '0',
                           width: '28px', // p-1.5 on a ~14px icon means ~28px button
                           height: '28px',
                           minWidth: '28px',
                        }}
                        onClick={() => console.log('Accept request', contact.id)}
                      >
                        {renderLucideIcon(CheckIcon, 14)}
                      </IonButton>
                      <IonButton
                        size="small"
                        shape="round"
                        style={{
                          '--background': '#E5E7EB', /* bg-gray-200 */
                          '--background-hover': '#D1D5DB', /* hover:bg-gray-300 */
                          '--color': '#4B5563', /* text-gray-600 */
                          '--padding-start': '0',
                          '--padding-end': '0',
                          '--padding-top': '0',
                          '--padding-bottom': '0',
                           width: '28px',
                           height: '28px',
                           minWidth: '28px',
                        }}
                        onClick={() => console.log('Decline request', contact.id)}
                      >
                        {renderLucideIcon(XIcon, 14)}
                      </IonButton>
                    </div>
                  )}
                  {contact.status === 'pending' && (
                    <IonText style={{ fontSize: '0.75rem', color: '#6B7280' /* gray-500 */ }}>
                      Pending
                    </IonText>
                  )}
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
        </IonList>
      </IonContent>

      <IonFooter>
        <IonToolbar className="ion-padding-vertical"> {/* Add some vertical padding */}
          <IonButton
            expand="block"
            className="ion-margin-horizontal" // Add horizontal margin
            style={{
                // text-sm font-medium text-white bg-blue-600 hover:bg-blue-700
                '--background': '#2563EB', /* bg-blue-600 */
                '--background-hover': '#1D4ED8', /* hover:bg-blue-700 */
                '--color': 'white',
                '--border-radius': '0.375rem', /* rounded-md */
                '--box-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.05)', /* shadow-sm */
                textTransform: 'none',
                fontWeight: 500, /* font-medium */
                fontSize: '0.875rem' /* text-sm */
            }}
            onClick={() => console.log('Add new contact clicked')}
          >
            {renderLucideIcon(UserPlusIcon, 18, undefined, { marginRight: '0.5rem' /* mr-2 */})}
            Add New Contact
          </IonButton>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Contacts;