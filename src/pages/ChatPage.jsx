import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL, chatService } from '../services/api';

const socketUrl = API_BASE_URL.replace(/\/api\/?$/, '');
const displayTime = (value) => value ? new Date(value).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '';

export default function ChatPage() {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);
  const activeIdRef = useRef('');
  const active = useMemo(() => conversations.find((item) => item.id === activeId), [conversations, activeId]);

  const refreshConversations = async () => {
    const rows = await chatService.conversations();
    setConversations(rows);
    return rows;
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const listingId = searchParams.get('listingId');
        let opened;
        if (listingId) {
          opened = await chatService.openForListing(listingId);
          setSearchParams({}, { replace: true });
        }
        const rows = await refreshConversations();
        if (!cancelled) setActiveId(opened?.id || rows[0]?.id || '');
      } catch (err) { if (!cancelled) setError(err.message); }
      finally { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []); // open the requested product once

  useEffect(() => {
    activeIdRef.current = activeId;
    if (!activeId) { setMessages([]); return; }
    chatService.messages(activeId).then(setMessages).catch((err) => setError(err.message));
  }, [activeId]);

  useEffect(() => {
    const socket = io(socketUrl, { auth: { token }, transports: ['websocket', 'polling'] });
    socket.on('chat:message', (message) => {
      if (message.conversationId === activeIdRef.current) setMessages((items) => items.some((item) => item.id === message.id) ? items : [...items, message]);
      refreshConversations().catch(() => {});
    });
    socket.on('connect_error', (err) => setError(`Realtime connection: ${err.message}`));
    return () => socket.disconnect();
  }, [token]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (event) => {
    event.preventDefault();
    const messageText = text.trim();
    if (!messageText || !activeId) return;
    setText(''); setError('');
    try {
      const message = await chatService.send(activeId, messageText);
      setMessages((items) => items.some((item) => item.id === message.id) ? items : [...items, message]);
      await refreshConversations();
    } catch (err) { setText(messageText); setError(err.message); }
  };

  if (loading) return <div className="empty">Loading chats...</div>;
  return <div className="chat-page">
    <aside className="chat-sidebar">
      <div className="chat-title"><span>MESSAGES</span><h1>Buyer & seller chat</h1></div>
      <div className="chat-conversations">
        {conversations.map((conversation) => <button key={conversation.id} className={conversation.id === activeId ? 'active' : ''} onClick={() => setActiveId(conversation.id)}>
          <span className="chat-avatar">{conversation.listingImage ? <img src={conversation.listingImage} alt=""/> : conversation.otherUser.name.slice(0, 2).toUpperCase()}</span>
          <span><strong>{conversation.otherUser.name}</strong><b>{conversation.listingTitle}</b><small>{conversation.preview}</small></span>
          <time>{displayTime(conversation.updatedAt)}</time>
        </button>)}
        {!conversations.length && <div className="chat-empty">Product par chat button dabakar seller se baat shuru karein.</div>}
      </div>
    </aside>
    <section className="chat-window">
      {active ? <>
        <header><span className="chat-avatar">{active.otherUser.name.slice(0, 2).toUpperCase()}</span><div><strong>{active.otherUser.name}</strong><small>{active.listingTitle} · You are the {active.role}</small></div></header>
        <div className="chat-messages">
          {!messages.length && <div className="chat-empty">Be the first to message. Personal payment details share na karein.</div>}
          {messages.map((message) => <div key={message.id} className={`chat-bubble ${message.sender === 'me' ? 'mine' : ''}`}><p>{message.text}</p><time>{displayTime(message.createdAt)}</time></div>)}
          <div ref={bottomRef}/>
        </div>
        {error && <div className="chat-error">{error}</div>}
        <form className="chat-compose" onSubmit={send}><input value={text} onChange={(event) => setText(event.target.value)} maxLength={2000} placeholder="Type a message..."/><button type="submit" disabled={!text.trim()}>Send</button></form>
      </> : <div className="chat-empty chat-empty-main">Select a conversation to start messaging.</div>}
    </section>
  </div>;
}
