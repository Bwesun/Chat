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
  IonFab,
  IonFabButton,
  IonIcon,
} from '@ionic/react';
import { SearchIcon, PlusIcon, MessageSquarePlus } from 'lucide-react'; // Lucide icons remain
import { addOutline } from 'ionicons/icons';

// Mock data (remains the same)
interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
}

const mockChats: Chat[] = [
  { id: '1', name: 'Sarah Johnson', lastMessage: 'Are we still meeting tomorrow?', time: '2:34 PM', unread: 2, avatar: 'https://randomuser.me/api/portraits/women/44.jpg', online: true },
  { id: '2', name: 'Michael Chen', lastMessage: 'I sent you the document.', time: '11:20 AM', unread: 0, avatar: 'https://randomuser.me/api/portraits/men/32.jpg', online: true },
  { id: '3', name: 'Team Project', lastMessage: "Alex: Let's discuss the timeline", time: 'Yesterday', unread: 5, avatar: 'https://randomuser.me/api/portraits/men/4.jpg', online: false },
  { id: '4', name: 'Jessica Williams', lastMessage: 'Thanks for your help!', time: 'Yesterday', unread: 0, avatar: 'https://randomuser.me/api/portraits/women/63.jpg', online: false },
  { id: '5', name: 'David Miller', lastMessage: 'How was your weekend?', time: 'Monday', unread: 0, avatar: 'https://randomuser.me/api/portraits/men/91.jpg', online: true },
];


const MessageList: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = mockChats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderLucideIcon = (IconComponent: React.ElementType, size: number, style?: React.CSSProperties, className?: string) => {
    return <IconComponent size={size} style={style} className={className} />;
  };


  return (
    <IonPage>
      <IonHeader translucent={true} className="ion-no-border">
        <IonToolbar color={'light'}>
          <IonTitle color={'primary'}>Messages</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSearchbar className='search-bar'
            value={searchQuery}
            color={'primary'}
            onIonChange={(e) => setSearchQuery(e.detail.value!)}
            placeholder="Search chats" 
            style={{
              '--placeholder-color': '--ion-color-light', 
              '--box-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.05)', // shadow-sm
              '--border-radius': '5rem', // rounded-lg
            }}
          >
          </IonSearchbar>
        
          {filteredChats.map((chat) => (
            <IonItem
              key={chat.id}
              routerLink={`/chat/${chat.id}`}
              button={true}
              detail={false}
              lines='none'
              style={{ '--inner-padding-end': '16px' }}
            >
              <div slot="start" style={{ position: 'relative' }}>
                <IonAvatar style={{ width: '48px', height: '48px' /* h-12 w-12 */ }}>
                  <img src={chat.avatar} alt={`${chat.name}'s avatar`} style={{ objectFit: 'cover', borderRadius: '50%'}} />
                </IonAvatar>
                {chat.online && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '2px', // Adjust for visual appeal
                      right: '2px',  // Adjust for visual appeal
                      display: 'block',
                      height: '12px', // h-3
                      width: '12px',  // w-3
                      borderRadius: '50%',
                      backgroundColor: '#4ADE80', // bg-green-400
                      border: '2px solid white', // ring-2 ring-white
                    }}
                  ></span>
                )}
              </div>
              <IonLabel style={{ marginLeft: '16px' /* ml-4 */ }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <h2 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827' /* gray-900 */, margin: 0 }}>
                    {chat.name}
                  </h2>
                  <p style={{ fontSize: '0.75rem', color: '#6B7280' /* gray-500 */, margin: 0 }}>
                    {chat.time}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' /* mt-1 */, width: '100%' }}>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: '#4B5563', /* gray-600 */
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      margin: 0,
                      paddingRight: chat.unread > 0 ? '8px' : '0' // Add padding if badge is present
                    }}
                  >
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <IonBadge
                      color="primary" // Corresponds to bg-blue-600
                      style={{
                        minWidth: '20px', // h-5 w-5
                        height: '20px',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem', // text-xs
                        fontWeight: 500,    // font-medium
                        // color: 'white' is default for IonBadge with color="primary"
                      }}
                    >
                      {chat.unread}
                    </IonBadge>
                  )}
                </div>
              </IonLabel>
            </IonItem>
          ))}
          {filteredChats.length === 0 && (
             <IonItem lines="none">
              <IonLabel className="ion-text-center" style={{ color: '#6B7280', marginTop: '20px', marginBottom: '20px' }}>
                No chats found.
              </IonLabel>
            </IonItem>
          )}

            <IonFab slot='fixed' vertical='bottom' horizontal='end'>
                <IonFabButton routerLink='/newchat'>
                    <MessageSquarePlus size={24} color={'white'} />
                </IonFabButton>
            </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default MessageList;