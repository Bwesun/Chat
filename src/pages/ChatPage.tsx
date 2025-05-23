import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom'; // useParams stays
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
  // IonLabel, // Can be used for text, but divs are fine for custom layout
  // IonItem, // Can be used for list items, but divs are fine here
} from '@ionic/react';
import {
  SendIcon,
  PaperclipIcon,
  SmileIcon,
  MicIcon,
  ImageIcon,
  ArrowLeftIcon,
} from 'lucide-react'; // Lucide icons remain
import { arrowBackOutline, sendOutline } from 'ionicons/icons';

// Mock data (remains the same)
const mockUsers = {
  '1': { id: '1', name: 'Sarah Johnson', avatar: 'https://randomuser.me/api/portraits/women/44.jpg', online: true, lastSeen: 'Now' },
  '2': { id: '2', name: 'Michael Chen', avatar: 'https://randomuser.me/api/portraits/men/32.jpg', online: true, lastSeen: 'Now' },
};

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

const mockMessages: Message[] = [
  { id: '1', senderId: '2', text: 'Hey there! How are you doing?', timestamp: '10:30 AM', status: 'read' },
  { id: '2', senderId: '1', text: "Hi Michael! I'm good, thanks for asking. How about you?", timestamp: '10:32 AM', status: 'read' },
  { id: '3', senderId: '2', text: "I'm doing well! Just wanted to check in about the project deadline. Are we still on track for Friday?", timestamp: '10:33 AM', status: 'read' },
  { id: '4', senderId: '1', text: "Yes, I've been working on it and should have everything ready by Thursday afternoon.", timestamp: '10:35 AM', status: 'read' },
  { id: '5', senderId: '2', text: 'That sounds perfect! Would you like to have a quick call tomorrow to go over any questions?', timestamp: '10:36 AM', status: 'read' },
  { id: '6', senderId: '1', text: 'Sure, that works for me. How about 2 PM?', timestamp: '10:40 AM', status: 'read' },
  { id: '7', senderId: '2', text: "Great! I'll send a calendar invite. Talk to you tomorrow!", timestamp: '10:41 AM', status: 'read' },
  { id: '8', senderId: '1', text: 'Looking forward to it!', timestamp: '10:42 AM', status: 'delivered' },
];

// For the typing indicator animation
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
  const { id } = useParams<{ id?: string }>(); // id can be undefined
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [isTyping, setIsTyping] = useState(false);
  const contentRef = useRef<HTMLIonContentElement>(null); // Ref for IonContent

  const currentUser = mockUsers['1']; // Assuming current user is '1'
  const chatPartnerId = id || '2'; // Default to '2' if no ID
  const otherUser = mockUsers[chatPartnerId as keyof typeof mockUsers] || mockUsers['2'];


  useEffect(() => {
    // Scroll to bottom when messages load or chat partner changes
    setTimeout(() => contentRef.current?.scrollToBottom(0), 200);

    // Simulate typing indicator (original logic)
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
  }, [chatPartnerId]); // Re-run if chatPartnerId changes

  const scrollToBottom = (behavior: 'smooth' | 'auto' = 'smooth') => {
    contentRef.current?.scrollToBottom(behavior === 'smooth' ? 300 : 0);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') return;

    const newMessage: Message = {
      id: String(Date.now()),
      senderId: currentUser.id,
      text: message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent' as 'sent',
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setMessage('');
    setTimeout(() => scrollToBottom('smooth'), 100); // Scroll after new message is rendered
  };

  // Group messages by date (simplified)
  const groupedMessages: Record<string, Message[]> = { 'Today': messages };
  // In a real app, you'd group by actual dates

  return (
    <IonPage>
      <style>{bounceAnimationStyles}</style> {/* Add animation styles */}
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            {/* Replicates Link to /home, hidden on md and up */}
            <IonButton fill='clear' routerLink="/home" className="ion-hide-md-up">
              <IonIcon icon={arrowBackOutline} slot='icon-only' />
            </IonButton>
          </IonButtons>
          <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '0.5rem' /* Adjust if back button is not shown */ }}>
            <IonAvatar style={{ height: '40px', width: '40px' }}>
              <img
                src={otherUser.avatar}
                alt={`${otherUser.name}'s avatar`}
                style={{ objectFit: 'cover', borderRadius: '50%' }}
              />
            </IonAvatar>
            <div style={{ marginLeft: '0.75rem', flex: 1 }}>
              <IonText color={'light'}>
                {otherUser.name}
              </IonText>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent ref={contentRef} scrollEvents={true} style={{ '--background': '#F9FAFB' /* bg-gray-50 */ }} className="ion-padding-horizontal">
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} style={{ marginBottom: '1rem' /* Approximate space-y-4 */}}>
            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
              <span style={{
                fontSize: '0.75rem',
                color: '#6B7280', /* text-gray-500 */
                backgroundColor: '#F3F4F6', /* bg-gray-100 */
                padding: '0.25rem 0.5rem',
                borderRadius: '9999px'
              }}>
                {date}
              </span>
            </div>
            {dateMessages.map((msg, index) => {
              const isCurrentUser = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                    marginBottom: '1rem', // Spacing between messages
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-end', maxWidth: '80%' /* Or max-w-xs equivalent */ }}>
                    {!isCurrentUser && (
                      <IonAvatar style={{ height: '32px', width: '32px', marginRight: '0.5rem', marginBottom: '0.25rem' }}>
                        <img
                          src={otherUser.avatar}
                          alt={`${otherUser.name}'s avatar`}
                          style={{ objectFit: 'cover', borderRadius: '50%' }}
                        />
                      </IonAvatar>
                    )}
                    <div
                      style={{
                        padding: '0.5rem 1rem', /* px-4 py-2 */
                        borderRadius: '0.5rem', /* rounded-lg */
                        backgroundColor: isCurrentUser ? '#2563EB' : '#E5E7EB', /* blue-600 : gray-200 */
                        color: isCurrentUser ? 'white' : '#1F2937', /* white : gray-800 */
                        borderBottomRightRadius: isCurrentUser ? '0' : undefined,
                        borderBottomLeftRadius: !isCurrentUser ? '0' : undefined,
                      }}
                    >
                      <p style={{ fontSize: '0.875rem', margin: 0 }}>{msg.text}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: '0.25rem' }}>
                        <span style={{ fontSize: '0.75rem', opacity: 0.7, marginRight: '0.25rem' }}>
                          {msg.timestamp}
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
        {isTyping && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <IonAvatar style={{ height: '32px', width: '32px', marginRight: '0.5rem', marginBottom: '0.25rem' }}>
                <img
                  src={otherUser.avatar}
                  alt={`${otherUser.name}'s avatar`}
                  style={{ objectFit: 'cover', borderRadius: '50%' }}
                />
              </IonAvatar>
              <div style={{
                backgroundColor: '#E5E7EB', /* bg-gray-200 */
                color: '#1F2937', /* text-gray-800 */
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                borderBottomLeftRadius: '0'
              }}>
                <div style={{ display: 'flex', columnGap: '0.25rem' /* space-x-1 */ }}>
                  {[0, 200, 400].map(delay => (
                    <div
                      key={delay}
                      className="animate-bounce-dot"
                      style={{
                        height: '0.5rem',
                        width: '0.5rem',
                        backgroundColor: '#6B7280', /* bg-gray-500 */
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

      <IonFooter>
        <IonToolbar>
          <form onSubmit={handleSendMessage} style={{ display: 'flex', alignItems: 'center', padding: '0.5rem' /* p-2 approx */}}>
            <IonInput
              type="text"
              placeholder="Type a message"
              value={message}
              onIonChange={(e) => setMessage(e.detail.value!)}
              style={{
                flex: 1,
                margin: '0 0.5rem', /* mx-2 */
                '--border-radius': '9999px', /* rounded-full */
                '--border-color': '#D1D5DB', /* border-gray-300 */
                '--padding-start': '1rem', /* px-4 (start) */
                '--padding-end': '1rem', /* px-4 (end) */
                '--background': '#fff',
                 minHeight: '40px', // Ensure consistent height
              }}
              mode="md" // Use md mode for more standard input look, or remove for default
              fill="outline" // Or "solid"
            />
              <IonButton
                type="submit"
                shape="round"
                color="secondary"
                disabled={!message.trim()}
              >
                <IonIcon color='light' icon={sendOutline} slot='icon-only' className='ion-paddin' />
              </IonButton>
          </form>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default ChatPage;