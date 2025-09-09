import React, { useEffect, useState, useRef } from 'react';
import { useHistory, useParams } from 'react-router-dom';
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
import { collection, query, where, orderBy, getDocs, doc, getDoc, or, QueryConstraint, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import CryptoJS from 'crypto-js';

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
  const [sentMessage, setSentMessage] = useState<any | null>(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatUser, setChatUser] = useState<User | null>(null);
  const contentRef = useRef<HTMLIonContentElement>(null);
  const history = useHistory();

  const SECRET_KEY = import.meta.env.VITE_CRYPT_SECRET_KEY;

  // Function to decrypt message
  function decryptMessage(encryptedText: string) {
    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Fetch chat partner user from Firestore
  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/${id}`);
        setChatUser(res.data);
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

    // Query for messages sent by current user to chat partner
    const q1 = query(
      collection(db, 'messages'),
      where('from_user_id', '==', user.uid),
      where('to_user_id', '==', id),
      orderBy('timestamp', 'asc')
    );
    // Query for messages sent by chat partner to current user
    const q2 = query(
      collection(db, 'messages'),
      where('from_user_id', '==', id),
      where('to_user_id', '==', user.uid),
      orderBy('timestamp', 'asc')
    );

    // Listen for realtime updates
    const unsub1 = onSnapshot(q1, (snap1) => {
      const msgs1 = snap1.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(prev => {
        // Combine with messages from q2 (if already set)
        const prevQ2 = prev.filter(m => m.from_user_id === id && m.to_user_id === user.uid);
        const all = [...msgs1, ...prevQ2];
        all.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
        // Decrypt all messages
        return all.map(msg => ({
          ...msg,
          text: decryptMessage(msg.text)
        }));
      });
    });

    const unsub2 = onSnapshot(q2, async (snap2) => {
      const msgs2 = snap2.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(prev => {
        // Combine with messages from q1 (if already set)
        const prevQ1 = prev.filter(m => m.from_user_id === user.uid && m.to_user_id === id);
        const all = [...prevQ1, ...msgs2];
        all.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
        // Decrypt all messages
        return all.map(msg => ({
          ...msg,
          text: decryptMessage(msg.text)
        }));
      });

      // --- Mark unread messages as read ---
      const unreadMessages = snap2.docs.filter(
        doc => doc.data().to_user_id === user.uid && doc.data().unread === true
      );
      for (const msgDoc of unreadMessages) {
        await updateDoc(msgDoc.ref, { unread: false });
      }
      // --- End mark as read ---
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, [user?.uid, id, SECRET_KEY]);

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

  // Scroll to bottom when messages change
    useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom('smooth');
    }
  }, [messages]);

  // Function to scroll to the bottom of the chat content
  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
    contentRef.current?.scrollToBottom(behavior === 'smooth' ? 300 : 0);
  };

  // Handle sending a new message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '' || !user?.uid || !id) return;

    const SECRET_KEY = import.meta.env.VITE_CRYPT_SECRET_KEY; // Dont forget to include secret key in your .env file in 256bits/32bytes 

    // Function to encrypt message
    function encryptMessage(message: string) {
      const encrypted = CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
      return encrypted;
    }
    setSentMessage(true);

    const newMessage: Message = {
      id: `${Date.now()}`,
      to_user_id: id,
      from_user_id: user.uid,
      text: encryptMessage(message),
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/message`, newMessage, {
        headers: { "Content-Type": "application/json" },
      });
      // setMessages(prevMessages => [...prevMessages, newMessage]);
      setSentMessage(false);
      setMessage('');
      setTimeout(() => scrollToBottom('smooth'), 100);
    } catch (error) {
      alert('Failed to send message.');
      console.log('Failed to send message.', error);
    }
  };

  // Group messages by date
  const groupedMessages: Record<string, Message[]> = { 'Today': messages };

  return (
    <IonPage>
      <style>{bounceAnimationStyles}</style>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton fill='clear' className="ion-hide-md-up" onClick={() => window.history.back()}>
              <IonIcon color='light' icon={arrowBackOutline} slot='icon-only' />
            </IonButton>
          </IonButtons>
          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '0.5rem' }} onClick={() => chatUser && history.push(`/viewprofile/${chatUser.id}`)}>
            <IonAvatar style={{ height: '40px', width: '40px' }} >
              <img
                src={import.meta.env.VITE_AVATAR_URL || ''}
                alt={chatUser?.firstname + ' ' + chatUser?.surname ? `${chatUser?.firstname}'s avatar` : 'Avatar'}
                style={{ objectFit: 'cover', borderRadius: '50%' }}
              />
            </IonAvatar>
            <div style={{ marginLeft: '0.75rem', flex: 1 }}>
              <IonText color={'light'}>
                {chatUser
                  ? chatUser.firstname + ' ' + chatUser.surname
                  : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <IonSpinner color={'primary'} name="dots" style={{ width: 20, height: 20 }} />
                      Loading...
                    </span>
                  )
                }
              </IonText>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent ref={contentRef} scrollEvents={true} style={{ '--background': 'var(--ion-color-light)' }}className="ion-padding-horizontal">
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
                          src={import.meta.env.VITE_AVATAR_URL || ''}
                          alt={chatUser?.firstname + ' ' + chatUser?.surname ? `${chatUser?.firstname}'s avatar` : 'Avatar'}
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
              onIonInput={(e) => setMessage(e.detail.value! ?? '')}
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
                disabled={!message.trim() || sentMessage}
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