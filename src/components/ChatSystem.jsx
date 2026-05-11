import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";

// ── helpers ──────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

function getInitials(name = "") {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(ts) {
  const d = new Date(ts);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { day: "numeric", month: "short" });
}

function groupByDate(messages) {
  const groups = [];
  let lastDate = null;
  messages.forEach((msg) => {
    const dateLabel = formatDate(msg.createdAt || msg.timestamp || Date.now());
    if (dateLabel !== lastDate) {
      groups.push({ type: "divider", label: dateLabel });
      lastDate = dateLabel;
    }
    groups.push({ type: "message", ...msg });
  });
  return groups;
}

// ── Avatar ────────────────────────────────────────────────────────────────────
function Avatar({ name, size = 40, online = false }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.4 }}>
        {getInitials(name)}
      </div>
      {online && (
        <span style={{ position: "absolute", bottom: 0, right: 0, width: size * 0.25, height: size * 0.25, borderRadius: "50%", background: "#1D9E75", border: "2px solid var(--bg-card)" }} />
      )}
    </div>
  );
}

// ── Main ChatSystem ───────────────────────────────────────────────────────────
export default function ChatSystem({ user: userData, initialTarget, onBack }) {
  const user = {
    _id: userData?.user?.id || userData?.id || "demo-user",
    fullName: userData?.user?.name || userData?.name || "User",
    token: userData?.token || null,
  };

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingMsgs, setIsLoadingMsgs] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const setupRef = useRef(null); // To prevent double-init in Strict Mode

  const activeConv = conversations.find((c) => c._id === activeConvId);
  const otherUser = activeConv?.participants?.find((p) => p._id !== user._id) || {};

  useEffect(() => {
    if (user.token) fetchConversations();
  }, [user.token]);

  // Handle Initial Target from Directory
  useEffect(() => {
    if (initialTarget && user.token && setupRef.current !== initialTarget._id) {
      setupRef.current = initialTarget._id || initialTarget.id;
      const setup = async () => {
        try {
          const res = await fetch(`${API_BASE}/api/conversations`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
            body: JSON.stringify({ participantId: initialTarget._id || initialTarget.id }),
          });
          const conv = await res.json();
          if (conv._id) {
            setConversations(prev => {
              // Check if we already have this conversation in state
              if (prev.some(c => c._id === conv._id)) return prev;
              return [conv, ...prev];
            });
            setActiveConvId(conv._id);
          }
        } catch (err) { 
          console.error(err); 
          setupRef.current = null; // Allow retry on error
        }
      };
      setup();
    }
  }, [initialTarget, user.token]);

  useEffect(() => {
    if (activeConvId && user.token) fetchMessages(activeConvId);
  }, [activeConvId]);

  useEffect(() => {
    if (!user.token) return;
    const socket = io(SOCKET_URL, { auth: { token: user.token } });
    socketRef.current = socket;
    socket.on("connect", () => socket.emit("join", { userId: user._id }));
    socket.on("online_users", (ids) => setOnlineUsers(new Set(ids)));
    socket.on("receive_message", (msg) => {
      if (msg.conversationId === activeConvId) setMessages((prev) => [...prev, msg]);
      setConversations((prev) => prev.map((c) => c._id === msg.conversationId ? { ...c, lastMessage: msg } : c));
    });
    // Listen for deleted messages
    socket.on("message_deleted", ({ messageId }) => {
      setMessages(prev => prev.filter(m => m._id !== messageId));
    });
    return () => socket.disconnect();
  }, [user.token, user._id, activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/conversations`, { headers: { Authorization: `Bearer ${user.token}` } });
      const data = await res.json();
      // Ensure no duplicates from server
      const unique = data.filter((v, i, a) => a.findIndex(t => t._id === v._id) === i);
      setConversations(unique);
    } catch (err) { console.error(err); }
  };

  const fetchMessages = async (convId) => {
    setIsLoadingMsgs(true);
    try {
      const res = await fetch(`${API_BASE}/api/messages/${convId}`, { headers: { Authorization: `Bearer ${user.token}` } });
      const data = await res.json();
      setMessages(data);
    } catch (err) { console.error(err); } finally { setIsLoadingMsgs(false); }
  };

  const sendMessage = useCallback(async () => {
    const text = inputText.trim();
    if (!text || !activeConvId || !user.token) return;
    try {
      const res = await fetch(`${API_BASE}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ conversationId: activeConvId, content: text }),
      });
      const saved = await res.json();
      setMessages((prev) => [...prev, saved]);
      setInputText("");
      socketRef.current?.emit("send_message", { ...saved, receiverId: otherUser._id });
    } catch (err) { console.error(err); }
  }, [inputText, activeConvId, user, otherUser]);

  const unsendMessage = async (msgId) => {
    if (!window.confirm("Unsend this message?")) return;
    try {
      await fetch(`${API_BASE}/api/messages/${msgId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages(prev => prev.filter(m => m._id !== msgId));
      socketRef.current?.emit("delete_message", { messageId: msgId, receiverId: otherUser._id });
    } catch (err) { console.error(err); }
  };

  const deleteConversation = async (e, convId) => {
    e.stopPropagation();
    if (!window.confirm("Delete this entire conversation?")) return;
    try {
      await fetch(`${API_BASE}/api/conversations/${convId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setConversations(prev => prev.filter(c => c._id !== convId));
      if (activeConvId === convId) setActiveConvId(null);
    } catch (err) { console.error(err); }
  };

  const filteredConvs = conversations.filter((c) => {
    const other = c.participants?.find((p) => p._id !== user._id);
    return (other?.fullName || other?.name || "").toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 96px)', background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border)', overflow: 'hidden' }}>
      {/* Sidebar List */}
      <div style={{ width: '320px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)' }}>
          <h2 className="section-heading" style={{ marginBottom: '16px' }}>Messages</h2>
          <input 
            placeholder="Search chats..." 
            className="body-text"
            style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredConvs.map(conv => {
            const other = conv.participants?.find(p => p._id !== user._id) || {};
            const active = conv._id === activeConvId;
            return (
              <div 
                key={conv._id} 
                onClick={() => setActiveConvId(conv._id)}
                className="conv-item"
                style={{ padding: '16px', cursor: 'pointer', background: active ? 'var(--bg-elevated)' : 'transparent', borderLeft: active ? '4px solid var(--primary)' : '4px solid transparent', display: 'flex', gap: '12px', alignItems: 'center', position: 'relative' }}
              >
                <Avatar name={other.fullName || other.name} size={40} online={onlineUsers.has(other._id)} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{other.fullName || other.name}</div>
                    <div className="meta-text" style={{ fontSize: '10px' }}>{conv.lastMessage?.createdAt && formatTime(conv.lastMessage.createdAt)}</div>
                  </div>
                  <div className="meta-text" style={{ fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {conv.lastMessage?.content || 'Start a conversation'}
                  </div>
                </div>
                <div className="delete-chat" onClick={(e) => deleteConversation(e, conv._id)} style={{ position: 'absolute', right: '12px', opacity: 0, transition: '0.2s' }}>🗑️</div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .conv-item:hover .delete-chat { opacity: 0.6 !important; }
        .delete-chat:hover { opacity: 1 !important; color: var(--secondary); }
        .msg-bubble:hover .unsend-btn { opacity: 1 !important; }
      `}</style>

      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeConv ? (
          <>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Avatar name={otherUser.fullName || otherUser.name} size={40} online={onlineUsers.has(otherUser._id)} />
              <div>
                <div style={{ fontWeight: 700 }}>{otherUser.fullName || otherUser.name}</div>
                <div className="meta-text" style={{ fontSize: '12px' }}>{onlineUsers.has(otherUser._id) ? 'Online' : 'Offline'}</div>
              </div>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {groupByDate(messages).map((item, idx) => {
                if (item.type === 'divider') return <div key={idx} style={{ textAlign: 'center', margin: '20px 0' }}><span className="meta-text" style={{ padding: '4px 12px', background: 'var(--bg-main)', borderRadius: '20px' }}>{item.label}</span></div>;
                const isMine = item.senderId === user._id;
                return (
                  <div key={item._id} className="msg-bubble" style={{ alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '70%', position: 'relative' }}>
                    <div style={{ padding: '10px 16px', borderRadius: '12px', background: isMine ? 'var(--primary)' : 'var(--bg-elevated)', color: isMine ? 'white' : 'var(--text-main)', fontSize: '14px' }}>
                      {item.content}
                    </div>
                    <div style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <div className="meta-text" style={{ fontSize: '10px' }}>
                        {formatTime(item.createdAt)}
                      </div>
                      {isMine && <span className="unsend-btn" onClick={() => unsendMessage(item._id)} style={{ fontSize: '10px', cursor: 'pointer', opacity: 0, color: 'var(--secondary)' }}>Unsend</span>}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '20px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input 
                  ref={inputRef}
                  placeholder="Type a message..." 
                  className="body-text"
                  style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-main)', border: '1px solid var(--border)', color: 'var(--text-main)' }}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="btn btn-primary" onClick={sendMessage}>Send</button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✉️</div>
            <h3 className="section-heading">Your Messages</h3>
            <p className="meta-text">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}