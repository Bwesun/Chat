import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonButton,
  IonIcon,
  IonAvatar,
  IonContent,
  IonFooter,
  IonInput,
  IonText,
  IonSpinner,
} from '@ionic/react';
import { arrowBackOutline, sendOutline } from 'ionicons/icons';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, orderBy, getDocs, doc, getDoc, or, QueryConstraint } from 'firebase/firestore';
import { db } from '../firebaseConfig';

interface Message {
  id: string;
  to_user_id: string;
  from_user_id: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface User {
  id: string;
  name: string;
  avatar: string;
  [key: string]: any;
}

const bounceAnimationStyles = `
  @keyframes bounce_dot {
    0%, 100% {
      transform: translateY(-25%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }
    50% {
      transform: translateY(0);
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }
  .animate-bounce-dot {
    animation: bounce_dot 1s infinite;
  }
`;

const ChatPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const { user, loading } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatUser, setChatUser] = useState<User | null>(null);
  const contentRef = useRef<HTMLIonContentElement>(null);

  // Fetch chat partner user from Firestore
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const userDoc = await getDoc(doc(db, "users", id));
        if (userDoc.exists()) {
          setChatUser({ id: userDoc.id, ...userDoc.data() } as User);
        } else {
          setChatUser(null);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setChatUser(null);
      }
    };
    fetchUser();
  }, [id]);

  // Fetch messages between current user and chat partner
  useEffect(() => {
    if (!user?.uid || !id) return;
    const fetchMessages = async () => {
      try {
        // Firestore doesn't support 'or' queries directly, so we fetch both directions and merge
        const q1 = query(
          collection(db, 'messages'),
          where('from_user_id', '==', user.uid),
          where('to_user_id', '==', id),
          orderBy('timestamp', 'asc')
        );
        const q2 = query(
          collection(db, 'messages'),
          where('from_user_id', '==', id),
          where('to_user_id', '==', user.uid),
          orderBy('timestamp', 'asc')
        );
        const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)]);
        const fetchedMessages: Message[] = [];
        snap1.forEach((doc) => {
          fetchedMessages.push({ id: doc.id, ...doc.data() } as Message);
        });
        snap2.forEach((doc) => {
          fetchedMessages.push({ id: doc.id, ...doc.data() } as Message);
        });
        // Sort all messages by timestamp
        fetchedMessages.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
        setMessages(fetchedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, [user?.uid, id]);

  // Typing indicator simulation (optional)
  useEffect(() => {
    setTimeout(() => contentRef.current?.scrollToBottom(0), 200);
    const typingTimeout = setTimeout(() => {
      setIsTyping(true);
      const innerTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
      return () => clearTimeout(innerTimeout);
    }, 2000);
    return () => {
      clearTimeout(typingTimeout);
    };
  }, [id]);

  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
    contentRef.current?.scrollToBottom(behavior === 'smooth' ? 300 : 0);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '' || !user?.uid || !id) return;

    const newMessage: Message = {
      id: `${Date.now()}`,
      to_user_id: id,
      from_user_id: user.uid,
      text: message,
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/message`, newMessage, {
        headers: { "Content-Type": "application/json" },
      });
      setMessages(prevMessages => [...prevMessages, newMessage]);
      setMessage('');
      setTimeout(() => scrollToBottom('smooth'), 100);
    } catch (error) {
      alert('Failed to send message.');
      console.log('Failed to send message.', error);
    }
  };

  // Group messages by date (simplified)
  const groupedMessages: Record<string, Message[]> = { 'Today': messages };

  return (
    <IonPage>
      <style>{bounceAnimationStyles}</style>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton fill='clear' className="ion-hide-md-up" onClick={() => history.back()}>
              <IonIcon icon={arrowBackOutline} slot='icon-only' />
            </IonButton>
          </IonButtons>
          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '0.5rem' }}>
            <IonAvatar style={{ height: '40px', width: '40px' }}>
              <img
                src={chatUser?.avatar || ''}
                alt={chatUser?.name ? `${chatUser.name}'s avatar` : 'Avatar'}
                style={{ objectFit: 'cover', borderRadius: '50%' }}
              />
            </IonAvatar>
            <div style={{ marginLeft: '0.75rem', flex: 1 }}>
              <IonText color={'light'}>
                {chatUser
                  ? chatUser.firstname + ' ' + chatUser.surname
                  : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <IonSpinner name="dots" style={{ width: 20, height: 20 }} />
                      Loading...
                    </span>
                  )
                }
              </IonText>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent ref={contentRef} scrollEvents={true} style={{ '--background': 'var(--ion-color-light)' }} className="ion-padding-horizontal">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
              <span style={{
                fontSize: '0.75rem',
                color: '#6B7280',
                backgroundColor: '#F3F4F6',
                padding: '0.25rem 0.5rem',
                borderRadius: '9999px'
              }}>
                {date}
              </span>
            </div>
            {dateMessages.map((msg) => {
              const isCurrentUser = msg.from_user_id === user?.uid;
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-end', maxWidth: '80%' }}>
                    {!isCurrentUser && (
                      <IonAvatar style={{ height: '32px', width: '32px', marginRight: '0.5rem', marginBottom: '0.25rem' }}>
                        <img
                          src={chatUser?.avatar || ''}
                          alt={chatUser?.name ? `${chatUser.name}'s avatar` : 'Avatar'}
                          style={{ objectFit: 'cover', borderRadius: '50%' }}
                        />
                      </IonAvatar>
                    )}
                    <div
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        backgroundColor: isCurrentUser ? '#721ab1' : '#E5E7EB',
                        color: isCurrentUser ? 'white' : '#1F2937',
                        borderBottomRightRadius: isCurrentUser ? '0' : undefined,
                        borderBottomLeftRadius: !isCurrentUser ? '0' : undefined,
                      }}
                    >
                      <p style={{ fontSize: '0.875rem', margin: 0 }}>{msg.text}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                        <span style={{ fontSize: '0.75rem', opacity: 0.7, marginRight: '0.25rem' }}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {isCurrentUser && (
                          <span style={{ fontSize: '0.75rem' }}>
                            {msg.status === 'read' ? '✓✓' : '✓'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && chatUser && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <IonAvatar style={{ height: '32px', width: '32px', marginRight: '0.5rem', marginBottom: '0.25rem' }}>
                <img
                  src={chatUser.avatar}
                  alt={`${chatUser.name}'s avatar`}
                  style={{ objectFit: 'cover', borderRadius: '50%' }}
                />
              </IonAvatar>
              <div style={{
                backgroundColor: '#E5E7EB',
                color: '#1F2937',
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                borderBottomLeftRadius: '0'
              }}>
                <div style={{ display: 'flex', columnGap: '0.25rem' }}>
                  {[0, 200, 400].map(delay => (
                    <div
                      key={delay}
                      className="animate-bounce-dot"
                      style={{
                        height: '0.5rem',
                        width: '0.5rem',
                        backgroundColor: '#6B7280',
                        borderRadius: '50%',
                        animationDelay: `${delay}ms`,
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </IonContent>

      <IonFooter className='ion-no-border'>
        <IonToolbar color={'light'} className='ion-no-border'
        style={{
          maxHeight: '100vh',
        }}>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' }}>
            <IonInput
              type="text"
              placeholder="Type a message"
              value={message}
              onIonChange={(e) => setMessage(e.detail.value!)}
              style={{
                '--padding-start': '1rem',
                '--padding-end': '1rem',
                backgroundColor: '#e9d1fa',
                minHeight: '40px',
                maxHeight: '100vh',
              }}
              mode="md"
            />
              <IonButton
                type="submit"
                shape="round"
                color="primary"
                disabled={!message.trim()}
              >
                <IonIcon color='light' icon={sendOutline} slot='icon-only' />
              </IonButton>
          </form>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default ChatPage;