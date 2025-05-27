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
  IonBadge,
  IonFab,
  IonFabButton,
  IonIcon,
  IonText,
  IonSpinner,
  IonButton,
} from '@ionic/react';
import { LogOut, MessageSquarePlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebaseConfig';
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  limit,
  onSnapshot,
} from 'firebase/firestore';
import { logOutOutline, personOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

const MessageList: React.FC = () => {
  const { user} = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<Chat[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const history = useHistory();

  useEffect(() => {
    if (!user?.uid) return;

    // Listen for changes in both sent and received messages
    const messagesRef = collection(db, 'messages');
    const qSent = query(messagesRef, where('from_user_id', '==', user.uid));
    const qReceived = query(messagesRef, where('to_user_id', '==', user.uid));

    // Store unsubscribe functions
    let unsubSent: (() => void) | null = null;
    let unsubReceived: (() => void) | null = null;

    setLoadingChats(true);

    // Helper to update chats when messages change
    const updateChats = async () => {
      try {
        // Fetch all messages where the user is either sender or receiver
        const [sentSnap, receivedSnap] = await Promise.all([
          getDocs(qSent),
          getDocs(qReceived)
        ]);

        // Collect unique chat partner IDs
        const chatPartnerIds = new Set<string>();
        sentSnap.forEach(doc => chatPartnerIds.add(doc.data().to_user_id));
        receivedSnap.forEach(doc => chatPartnerIds.add(doc.data().from_user_id));
        chatPartnerIds.delete(user.uid);

        // For each partner, fetch user info and latest message
        const chatPromises = Array.from(chatPartnerIds).map(async (partnerId) => {
          const userDoc = await getDoc(doc(db, 'users', partnerId));
          const userData = userDoc.exists() ? userDoc.data() : { name: 'Unknown', avatar: '' };

          // Fetch latest message FROM user TO partner
          const q1 = query(
            messagesRef,
            where('from_user_id', '==', user.uid),
            where('to_user_id', '==', partnerId),
            orderBy('timestamp', 'desc'),
            limit(1)
          );
          // Fetch latest message FROM partner TO user
          const q2 = query(
            messagesRef,
            where('from_user_id', '==', partnerId),
            where('to_user_id', '==', user.uid),
            orderBy('timestamp', 'desc'),
            limit(1)
          );
          const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);

          let lastMsgDoc = null;
          if (!snap1.empty && !snap2.empty) {
            lastMsgDoc =
              snap1.docs[0].data().timestamp > snap2.docs[0].data().timestamp
                ? snap1.docs[0]
                : snap2.docs[0];
          } else if (!snap1.empty) {
            lastMsgDoc = snap1.docs[0];
          } else if (!snap2.empty) {
            lastMsgDoc = snap2.docs[0];
          }

          if (!lastMsgDoc) return null;

          const msg = lastMsgDoc.data();
          const lastMessage = msg.text;
          const lastTime = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

          // Count unread messages from partner to user
          const unreadQuery = query(
            messagesRef,
            where('from_user_id', '==', partnerId),
            where('to_user_id', '==', user.uid),
            where('unread', '==', true)
          );
          const unreadSnap = await getDocs(unreadQuery);
          const unread = unreadSnap.size;

          return {
            id: partnerId,
            name: userData.firstname && userData.surname
              ? `${userData.firstname} ${userData.surname}`
              : userData.name || 'Unknown',
            avatar: userData.avatar || '',
            lastMessage,
            time: lastTime,
            unread,
            online: !!userData.online,
          } as Chat;
        });

        const chatList = (await Promise.all(chatPromises)).filter(Boolean) as Chat[];
        // Sort by last message time (descending)
        chatList.sort((a, b) => (b.time > a.time ? 1 : -1));
        setChats(chatList);
        console.log('Fetched chats:', chatList);
      } catch (err) {
        setChats([]);
        alert('Failed to fetch chats. Please try again later.');
        console.error('Error fetching chats:', err);
      }
      setLoadingChats(false);
    };

    unsubSent = onSnapshot(qSent, updateChats);
    unsubReceived = onSnapshot(qReceived, updateChats);

    // Initial fetch
    updateChats();

    return () => {
      unsubSent && unsubSent();
      unsubReceived && unsubReceived();
    };
  }, [user?.uid]);

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <IonPage>
      <IonHeader translucent={true} className="ion-no-border">
        <IonToolbar color={'light'}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <IonTitle color={'primary'}>Messages</IonTitle>
          <IonButton color={'primary'} onClick={() => {
            history.push('/profile');
          }
          } shape='round' className="">
            <IonIcon slot='icon-only' color='light' icon={personOutline} />
          </IonButton>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonSearchbar
          className='search-bar'
          value={searchQuery}
          color={'primary'}
          onIonInput={e => setSearchQuery(e.detail.value! ?? '')}
          placeholder="Search chats"
          style={{
            '--placeholder-color': '--ion-color-light',
            '--box-shadow': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            '--border-radius': '5rem',
          }}
        />

        {loadingChats ? (
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <IonText color="medium" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <IonSpinner color={'primary'} name="dots" style={{ width: 24, height: 24, marginRight: 8 }}></IonSpinner>
              Loading chats...
            </IonText>
          </div>
        ) : filteredChats.length === 0 ? (
          <IonItem lines="none">
            <IonLabel className="ion-text-center" style={{ color: '#6B7280', marginTop: '20px', marginBottom: '20px' }}>
              No chats found.
            </IonLabel>
          </IonItem>
        ) : (
          filteredChats.map((chat) => (
            <IonItem
              key={chat.id}
              routerLink={`/chat/${chat.id}`}
              button={true}
              detail={false}
              lines='none'
              style={{ '--inner-padding-end': '16px' }}
            >
              <div slot="start" style={{ position: 'relative' }}>
                <IonAvatar style={{ width: '48px', height: '48px' }}>
                  <img src={import.meta.env.VITE_AVATAR_URL || ''} alt={`${chat.name}'s avatar`} style={{ objectFit: 'cover', borderRadius: '50%' }} />
                </IonAvatar>
                {chat.online && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '2px',
                      right: '2px',
                      display: 'block',
                      height: '12px',
                      width: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#4ADE80',
                      border: '2px solid white',
                    }}
                  ></span>
                )}
              </div>
              <IonLabel style={{ marginLeft: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                  <h2 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#111827', margin: 0 }}>
                    {chat.name}
                  </h2>
                  <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>
                    {chat.time}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem', width: '100%' }}>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: '#4B5563',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      margin: 0,
                      paddingRight: chat.unread > 0 ? '8px' : '0'
                    }}
                  >
                    {chat.lastMessage}
                  </p>
                  {chat.unread > 0 && (
                    <IonBadge
                      color="primary"
                      style={{
                        minWidth: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                      }}
                    >
                      {chat.unread}
                    </IonBadge>
                  )}
                </div>
              </IonLabel>
            </IonItem>
          ))
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