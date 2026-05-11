import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";

// ── helpers ──────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
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

// Group messages by date for dividers
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
  const colors = [
    { bg: "#1D9E75", text: "#fff" },
    { bg: "#378ADD", text: "#fff" },
    { bg: "#7F77DD", text: "#fff" },
    { bg: "#D85A30", text: "#fff" },
    { bg: "#D4537E", text: "#fff" },
    { bg: "#BA7517", text: "#fff" },
  ];
  const color = colors[(name?.charCodeAt(0) || 0) % colors.length];
  return (
    <div className="sc-avatar-wrap" style={{ width: size, height: size, flexShrink: 0 }}>
      <div
        className="sc-avatar"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          background: color.bg,
          color: color.text,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          fontSize: size * 0.36,
          letterSpacing: "0.03em",
          userSelect: "none",
        }}
      >
        {getInitials(name)}
      </div>
      {online && (
        <span
          style={{
            position: "absolute",
            bottom: 1,
            right: 1,
            width: size * 0.28,
            height: size * 0.28,
            borderRadius: "50%",
            background: "#1D9E75",
            border: "2px solid var(--sc-surface)",
          }}
        />
      )}
    </div>
  );
}

// ── MessageBubble ─────────────────────────────────────────────────────────────
function MessageBubble({ msg, isMine }) {
  return (
    <div
      className="sc-msg-row"
      style={{
        display: "flex",
        flexDirection: isMine ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: 8,
        marginBottom: 4,
      }}
    >
      {!isMine && <Avatar name={msg.senderName || "User"} size={30} />}
      <div style={{ maxWidth: "68%", display: "flex", flexDirection: "column", alignItems: isMine ? "flex-end" : "flex-start" }}>
        {!isMine && (
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--sc-accent)", marginBottom: 3, paddingLeft: 4 }}>
            {msg.senderName}
          </span>
        )}
        <div
          style={{
            padding: "9px 14px",
            borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            background: isMine ? "var(--sc-accent)" : "var(--sc-bubble)",
            color: isMine ? "#fff" : "var(--sc-text)",
            fontSize: 14,
            lineHeight: 1.5,
            wordBreak: "break-word",
          }}
        >
          {msg.content}
        </div>
        <span style={{ fontSize: 10, color: "var(--sc-muted)", marginTop: 3, paddingRight: isMine ? 2 : 0, paddingLeft: isMine ? 0 : 2 }}>
          {formatTime(msg.createdAt || msg.timestamp || Date.now())}
          {isMine && (
            <span style={{ marginLeft: 4 }}>
              {msg.read ? "✓✓" : "✓"}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

// ── ConversationItem ──────────────────────────────────────────────────────────
function ConversationItem({ conv, isActive, onClick, currentUserId }) {
  const other = conv.participants?.find((p) => p._id !== currentUserId) || {};
  const unread = conv.unreadCount || 0;
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 16px",
        width: "100%",
        background: isActive ? "var(--sc-active-bg)" : "transparent",
        border: "none",
        borderLeft: isActive ? "3px solid var(--sc-accent)" : "3px solid transparent",
        cursor: "pointer",
        textAlign: "left",
        transition: "background 0.15s",
      }}
    >
      <div style={{ position: "relative" }}>
        <Avatar name={other.fullName || other.name || other.username || "?"} size={42} online={conv.isOnline} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontWeight: 600, fontSize: 13.5, color: "var(--sc-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 140 }}>
            {other.fullName || other.name || other.username || "Unknown"}
          </span>
          <span style={{ fontSize: 10.5, color: "var(--sc-muted)", flexShrink: 0, marginLeft: 6 }}>
            {conv.lastMessage?.createdAt ? formatTime(conv.lastMessage.createdAt) : ""}
          </span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
          <span style={{ fontSize: 12, color: "var(--sc-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 150 }}>
            {conv.lastMessage?.content || "No messages yet"}
          </span>
          {unread > 0 && (
            <span style={{
              background: "var(--sc-accent)",
              color: "#fff",
              borderRadius: 10,
              fontSize: 10,
              fontWeight: 700,
              padding: "1px 6px",
              marginLeft: 4,
              flexShrink: 0,
            }}>
              {unread}
            </span>
          )}
        </div>
        {other.house && (
          <span style={{ fontSize: 10, color: "var(--sc-accent)", fontWeight: 600, letterSpacing: "0.04em" }}>
            {other.house} · {other.role || "Alumni"}
          </span>
        )}
      </div>
    </button>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyChat() {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, padding: 32, opacity: 0.7 }}>
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="27.5" stroke="var(--sc-border)" />
        <path d="M16 20h24v13a3 3 0 01-3 3H19l-5 4v-4a3 3 0 01-3-3v-4" stroke="var(--sc-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="22" cy="26.5" r="1.5" fill="var(--sc-accent)" />
        <circle cx="28" cy="26.5" r="1.5" fill="var(--sc-accent)" />
        <circle cx="34" cy="26.5" r="1.5" fill="var(--sc-accent)" />
      </svg>
      <p style={{ fontSize: 15, fontWeight: 600, color: "var(--sc-text)", margin: 0 }}>Select a conversation</p>
      <p style={{ fontSize: 13, color: "var(--sc-muted)", textAlign: "center", margin: 0 }}>
        Choose a mentor or peer from the left to start messaging
      </p>
    </div>
  );
}

// ── TypingIndicator ───────────────────────────────────────────────────────────
function TypingIndicator({ name }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, padding: "4px 0" }}>
      <Avatar name={name} size={30} />
      <div style={{
        padding: "10px 14px",
        borderRadius: "18px 18px 18px 4px",
        background: "var(--sc-bubble)",
        display: "flex",
        gap: 4,
        alignItems: "center",
      }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "var(--sc-muted)",
            animation: `sc-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Main ChatSystem ───────────────────────────────────────────────────────────
export default function ChatSystem({ user: userData, initialTarget, onBack }) {
  // Normalize user object
  const user = {
    _id: userData?.user?.id || userData?.id || "demo-user-001",
    fullName: userData?.user?.name || userData?.name || "Demo Student",
    role: userData?.user?.role || userData?.role || "Student",
    token: userData?.token || null,
  };

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [typingUsers, setTypingUsers] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingMsgs, setIsLoadingMsgs] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDark, setIsDark] = useState(document.documentElement.getAttribute('data-theme') === 'dark');

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  const activeConv = conversations.find((c) => c._id === activeConvId);
  const otherUser = activeConv?.participants?.find((p) => p._id !== user._id) || {};

  // ── Demo seed data ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user.token) {
      // Seed with demo data so the UI is immediately usable
      const now = Date.now();
      setConversations([
        {
          _id: "c1",
          participants: [
            { _id: user._id, fullName: user.fullName },
            { _id: "u2", fullName: "James Kamau", role: "Alumni", house: "Pioneer", username: "jkamau" },
          ],
          lastMessage: { content: "Looking forward to our session!", createdAt: new Date(now - 120000).toISOString() },
          unreadCount: 2,
          isOnline: true,
        },
        {
          _id: "c2",
          participants: [
            { _id: user._id, fullName: user.fullName },
            { _id: "u3", fullName: "Samuel Mwangi", role: "Alumni", house: "Harambee", username: "smwangi" },
          ],
          lastMessage: { content: "Have you checked out the resources I shared?", createdAt: new Date(now - 3600000).toISOString() },
          unreadCount: 0,
          isOnline: false,
        },
        {
          _id: "c3",
          participants: [
            { _id: user._id, fullName: user.fullName },
            { _id: "u4", fullName: "Faith Njoroge", role: "Student", house: "Unity", username: "fnjoroge" },
          ],
          lastMessage: { content: "See you at the mentorship event!", createdAt: new Date(now - 86400000).toISOString() },
          unreadCount: 0,
          isOnline: true,
        },
      ]);
      return;
    }
    fetchConversations();
  }, [user.token]);

  // Handle initial target
  useEffect(() => {
    if (initialTarget && user.token) {
      const setupInitialChat = async () => {
        try {
          const res = await fetch(`${API_BASE}/api/conversations`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}` 
            },
            body: JSON.stringify({ participantId: initialTarget._id || initialTarget.id }),
          });
          const conv = await res.json();
          if (conv._id) {
            setConversations(prev => {
              if (prev.find(c => c._id === conv._id)) return prev;
              return [conv, ...prev];
            });
            setActiveConvId(conv._id);
          }
        } catch (err) {
          console.error("Failed to setup initial chat:", err);
        }
      };
      setupInitialChat();
    }
  }, [initialTarget, user.token]);

  useEffect(() => {
    if (activeConvId && !user.token) {
      const now = Date.now();
      const seedMessages = {
        c1: [
          { _id: "m1", senderId: "u2", senderName: "James Kamau", content: "Hey! I saw your profile on StareheConnect. Impressive stuff.", createdAt: new Date(now - 600000).toISOString() },
          { _id: "m2", senderId: user._id, senderName: user.fullName, content: "Thank you! I've been looking for a mentor in software engineering.", createdAt: new Date(now - 540000).toISOString() },
          { _id: "m3", senderId: "u2", senderName: "James Kamau", content: "Great! I graduated in 2015 and now work at Safaricom as a senior engineer. Happy to help.", createdAt: new Date(now - 480000).toISOString() },
          { _id: "m4", senderId: user._id, senderName: user.fullName, content: "That's amazing! Could we schedule a call this week?", createdAt: new Date(now - 240000).toISOString() },
          { _id: "m5", senderId: "u2", senderName: "James Kamau", content: "Looking forward to our session!", createdAt: new Date(now - 120000).toISOString() },
        ],
        c2: [
          { _id: "m6", senderId: "u3", senderName: "Samuel Mwangi", content: "I've uploaded some resources for your KCSE prep to Google Drive.", createdAt: new Date(now - 7200000).toISOString() },
          { _id: "m7", senderId: user._id, senderName: user.fullName, content: "Thank you so much! I'll go through them tonight.", createdAt: new Date(now - 7000000).toISOString() },
          { _id: "m8", senderId: "u3", senderName: "Samuel Mwangi", content: "Have you checked out the resources I shared?", createdAt: new Date(now - 3600000).toISOString() },
        ],
        c3: [
          { _id: "m9", senderId: "u4", senderName: "Faith Njoroge", content: "Are you going to the alumni mentorship event on Saturday?", createdAt: new Date(now - 90000000).toISOString() },
          { _id: "m10", senderId: user._id, senderName: user.fullName, content: "Yes! I registered already.", createdAt: new Date(now - 89000000).toISOString() },
          { _id: "m11", senderId: "u4", senderName: "Faith Njoroge", content: "See you at the mentorship event!", createdAt: new Date(now - 88000000).toISOString() },
        ],
      };
      setMessages(seedMessages[activeConvId] || []);
      return;
    }
    if (activeConvId) fetchMessages(activeConvId);
  }, [activeConvId]);

  // ── Socket setup ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user.token) return;
    const socket = io(SOCKET_URL, { auth: { token: user.token } });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join", { userId: user._id });
    });

    socket.on("online_users", (ids) => setOnlineUsers(new Set(ids)));
    socket.on("user_online", (id) => setOnlineUsers((prev) => new Set([...prev, id])));
    socket.on("user_offline", (id) => setOnlineUsers((prev) => { const s = new Set(prev); s.delete(id); return s; }));

    socket.on("receive_message", (msg) => {
      if (msg.conversationId === activeConvId) {
        setMessages((prev) => [...prev, msg]);
      }
      setConversations((prev) =>
        prev.map((c) =>
          c._id === msg.conversationId
            ? { ...c, lastMessage: msg, unreadCount: c._id === activeConvId ? 0 : (c.unreadCount || 0) + 1 }
            : c
        )
      );
    });

    socket.on("typing", ({ userId, conversationId, name }) => {
      if (conversationId === activeConvId && userId !== user._id) {
        setTypingUsers((prev) => ({ ...prev, [userId]: name }));
      }
    });

    socket.on("stop_typing", ({ userId }) => {
      setTypingUsers((prev) => { const n = { ...prev }; delete n[userId]; return n; });
    });

    return () => socket.disconnect();
  }, [user.token, user._id, activeConvId]);

  // ── Scroll to bottom ────────────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  // ── API calls ───────────────────────────────────────────────────────────────
  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/conversations`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setConversations(data);
    } catch (err) {
      console.error("Failed to load conversations:", err);
    }
  };

  const fetchMessages = async (convId) => {
    setIsLoadingMsgs(true);
    try {
      const res = await fetch(`${API_BASE}/api/messages/${convId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setIsLoadingMsgs(false);
    }
  };

  // ── Send message ────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    const text = inputText.trim();
    if (!text || !activeConvId) return;

    const optimistic = {
      _id: `tmp-${Date.now()}`,
      senderId: user._id,
      senderName: user.fullName,
      content: text,
      conversationId: activeConvId,
      createdAt: new Date().toISOString(),
      pending: true,
    };

    setMessages((prev) => [...prev, optimistic]);
    setInputText("");
    inputRef.current?.focus();

    if (!user.token) return; // demo mode — just show optimistic

    try {
      const res = await fetch(`${API_BASE}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ conversationId: activeConvId, content: text }),
      });
      const saved = await res.json();
      setMessages((prev) => prev.map((m) => (m._id === optimistic._id ? saved : m)));
      socketRef.current?.emit("send_message", { ...saved, receiverId: otherUser._id });
      setConversations((prev) =>
        prev.map((c) => (c._id === activeConvId ? { ...c, lastMessage: saved } : c))
      );
    } catch {
      setMessages((prev) => prev.map((m) => m._id === optimistic._id ? { ...m, failed: true } : m));
    }
  }, [inputText, activeConvId, user, otherUser]);

  // ── Typing events ───────────────────────────────────────────────────────────
  const handleTyping = (e) => {
    setInputText(e.target.value);
    if (!user.token) return;
    socketRef.current?.emit("typing", { conversationId: activeConvId, userId: user._id, name: user.fullName });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current?.emit("stop_typing", { conversationId: activeConvId, userId: user._id });
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ── Filtered conversations ──────────────────────────────────────────────────
  const filteredConvs = conversations.filter((c) => {
    if (!searchQuery) return true;
    const other = c.participants?.find((p) => p._id !== user._id);
    const name = other?.fullName || other?.username || "";
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const grouped = groupByDate(messages);
  const typingNames = Object.values(typingUsers);

  // ── Styles ──────────────────────────────────────────────────────────────────
  const cssVars = isDark
    ? {
      "--sc-bg": "#0f1117",
      "--sc-surface": "#181c25",
      "--sc-bubble": "#252a35",
      "--sc-active-bg": "rgba(29,158,117,0.12)",
      "--sc-border": "rgba(255,255,255,0.08)",
      "--sc-text": "#e8eaf0",
      "--sc-muted": "#6b7280",
      "--sc-accent": "#1D9E75",
      "--sc-header": "#1a1f2b",
    }
    : {
      "--sc-bg": "#f7f8fa",
      "--sc-surface": "#ffffff",
      "--sc-bubble": "#f0f2f5",
      "--sc-active-bg": "rgba(29,158,117,0.06)",
      "--sc-border": "rgba(0,0,0,0.08)",
      "--sc-text": "#1a1d23",
      "--sc-muted": "#8d94a0",
      "--sc-accent": "#0F6E56",
      "--sc-header": "#fff",
    };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .sc-root * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }
        .sc-root button:hover { opacity: 0.85; }
        .sc-conv-btn:hover { background: var(--sc-active-bg) !important; }
        .sc-send-btn { background: var(--sc-accent) !important; color: #fff !important; border: none !important; border-radius: 50% !important; width: 38px !important; height: 38px !important; display: flex !important; align-items: center !important; justify-content: center !important; cursor: pointer !important; transition: transform 0.1s, opacity 0.15s !important; flex-shrink: 0 !important; }
        .sc-send-btn:hover { opacity: 1 !important; transform: scale(1.06) !important; }
        .sc-send-btn:active { transform: scale(0.94) !important; }
        .sc-input { background: var(--sc-bubble) !important; border: 1px solid var(--sc-border) !important; border-radius: 22px !important; padding: 9px 16px !important; color: var(--sc-text) !important; font-size: 14px !important; resize: none !important; flex: 1 !important; outline: none !important; max-height: 100px !important; line-height: 1.5 !important; font-family: 'DM Sans', sans-serif !important; }
        .sc-input::placeholder { color: var(--sc-muted); }
        .sc-input:focus { border-color: var(--sc-accent) !important; }
        .sc-avatar-wrap { position: relative; }
        .sc-search { background: var(--sc-bubble) !important; border: 1px solid var(--sc-border) !important; border-radius: 20px !important; padding: 7px 14px 7px 36px !important; color: var(--sc-text) !important; font-size: 13px !important; outline: none !important; width: 100% !important; font-family: 'DM Sans', sans-serif !important; }
        .sc-search::placeholder { color: var(--sc-muted); }
        .sc-search:focus { border-color: var(--sc-accent) !important; }
        .sc-scrollbar::-webkit-scrollbar { width: 4px; }
        .sc-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .sc-scrollbar::-webkit-scrollbar-thumb { background: var(--sc-border); border-radius: 4px; }
        @keyframes sc-bounce { 0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; } 40% { transform: scale(1); opacity: 1; } }
        @keyframes sc-fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        .sc-msg-row { animation: sc-fadein 0.18s ease; }
      `}</style>

      <div
        className="sc-root"
        style={{
          ...cssVars,
          display: "flex",
          height: "100vh",
          background: "var(--sc-bg)",
          overflow: "hidden",
        }}
      >
        {/* ── Sidebar ── */}
        {sidebarOpen && (
          <aside style={{
            width: 300,
            flexShrink: 0,
            background: "var(--sc-surface)",
            borderRight: "1px solid var(--sc-border)",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}>
            {/* Sidebar header */}
            <div style={{
              padding: "16px 16px 12px",
              borderBottom: "1px solid var(--sc-border)",
              background: "var(--sc-header)",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: "var(--sc-accent)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 3h10v8a2 2 0 01-2 2H5a2 2 0 01-2-2V3z" stroke="#fff" strokeWidth="1.4" fill="none" />
                      <path d="M6 7h4M6 9.5h2.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span style={{ fontWeight: 700, fontSize: 15, color: "var(--sc-text)" }}>Messages</span>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  <button
                    onClick={() => setIsDark((d) => !d)}
                    style={{
                      background: "none", border: "none", padding: "4px 6px",
                      cursor: "pointer", color: "var(--sc-muted)", borderRadius: 6, fontSize: 14,
                    }}
                    title="Toggle theme"
                  >
                    {isDark ? "☀️" : "🌙"}
                  </button>
                  <button
                    onClick={onBack}
                    style={{
                      background: "none", border: "none", padding: "4px 6px",
                      cursor: "pointer", color: "var(--sc-muted)", borderRadius: 6, fontSize: 14,
                    }}
                    title="Go back"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    style={{
                      background: "none", border: "none", padding: "4px 6px",
                      cursor: "pointer", color: "var(--sc-muted)", borderRadius: 6, fontSize: 16,
                    }}
                  >✕</button>
                </div>
              </div>

              {/* Search */}
              <div style={{ position: "relative" }}>
                <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                  width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="6" cy="6" r="4.5" stroke="var(--sc-muted)" strokeWidth="1.4" />
                  <path d="M9.5 9.5l2.5 2.5" stroke="var(--sc-muted)" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                <input
                  className="sc-search"
                  placeholder="Search conversations…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Conversation list */}
            <div className="sc-scrollbar" style={{ flex: 1, overflowY: "auto" }}>
              {filteredConvs.length === 0 && (
                <p style={{ padding: 24, color: "var(--sc-muted)", fontSize: 13, textAlign: "center" }}>
                  No conversations found
                </p>
              )}
              {filteredConvs.map((conv) => (
                <ConversationItem
                  key={conv._id}
                  conv={{
                    ...conv,
                    isOnline: onlineUsers.has(conv.participants?.find((p) => p._id !== user._id)?._id),
                  }}
                  isActive={conv._id === activeConvId}
                  currentUserId={user._id}
                  onClick={() => setActiveConvId(conv._id)}
                />
              ))}
            </div>

            {/* Current user footer */}
            <div style={{
              padding: "12px 16px",
              borderTop: "1px solid var(--sc-border)",
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "var(--sc-header)",
            }}>
              <Avatar name={user.fullName} size={34} online />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "var(--sc-text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user.fullName}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: "var(--sc-accent)", fontWeight: 600 }}>
                  {user.role || "Student"} · Online
                </p>
              </div>
            </div>
          </aside>
        )}

        {/* ── Chat area ── */}
        <main style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100%" }}>

          {/* Chat header */}
          <div style={{
            height: 60,
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "var(--sc-header)",
            borderBottom: "1px solid var(--sc-border)",
            flexShrink: 0,
          }}>
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sc-text)", fontSize: 20, padding: 4 }}
              >☰</button>
            )}

            {activeConv ? (
              <>
                <div style={{ position: "relative" }}>
                  <Avatar name={otherUser.fullName || otherUser.name || otherUser.username} size={38} online={onlineUsers.has(otherUser._id)} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14.5, color: "var(--sc-text)" }}>
                    {otherUser.fullName || otherUser.name || otherUser.username}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: onlineUsers.has(otherUser._id) ? "var(--sc-accent)" : "var(--sc-muted)" }}>
                    {onlineUsers.has(otherUser._id) ? "Online" : "Offline"}
                    {otherUser.house ? ` · ${otherUser.house} House` : ""}
                  </p>
                </div>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--sc-muted)", padding: 4 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="4" r="1.5" fill="currentColor" />
                    <circle cx="9" cy="9" r="1.5" fill="currentColor" />
                    <circle cx="9" cy="14" r="1.5" fill="currentColor" />
                  </svg>
                </button>
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--sc-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 3h10v8a2 2 0 01-2 2H5a2 2 0 01-2-2V3z" stroke="#fff" strokeWidth="1.4" fill="none" />
                  </svg>
                </div>
                <span style={{ fontWeight: 700, fontSize: 15, color: "var(--sc-text)" }}>StareheConnect Chat</span>
              </div>
            )}
          </div>

          {/* Messages or empty state */}
          {!activeConvId ? (
            <EmptyChat />
          ) : (
            <>
              <div
                className="sc-scrollbar"
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "16px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {isLoadingMsgs && (
                  <div style={{ textAlign: "center", color: "var(--sc-muted)", fontSize: 13, padding: 20 }}>
                    Loading messages…
                  </div>
                )}

                {grouped.map((item, idx) => {
                  if (item.type === "divider") {
                    return (
                      <div key={`d-${idx}`} style={{
                        display: "flex", alignItems: "center", gap: 10, margin: "12px 0 8px",
                      }}>
                        <div style={{ flex: 1, height: 1, background: "var(--sc-border)" }} />
                        <span style={{ fontSize: 11, color: "var(--sc-muted)", fontWeight: 600, letterSpacing: "0.04em" }}>
                          {item.label}
                        </span>
                        <div style={{ flex: 1, height: 1, background: "var(--sc-border)" }} />
                      </div>
                    );
                  }
                  return (
                    <MessageBubble
                      key={item._id}
                      msg={item}
                      isMine={item.senderId === user._id}
                    />
                  );
                })}

                {typingNames.length > 0 && (
                  <TypingIndicator name={typingNames[0]} />
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input bar */}
              <div style={{
                padding: "12px 16px",
                background: "var(--sc-header)",
                borderTop: "1px solid var(--sc-border)",
                display: "flex",
                alignItems: "flex-end",
                gap: 10,
                flexShrink: 0,
              }}>
                <textarea
                  ref={inputRef}
                  className="sc-input"
                  rows={1}
                  placeholder="Type a message…"
                  value={inputText}
                  onChange={handleTyping}
                  onKeyDown={handleKeyDown}
                />
                <button
                  className="sc-send-btn"
                  onClick={sendMessage}
                  disabled={!inputText.trim()}
                  style={{ opacity: inputText.trim() ? 1 : 0.4 }}
                  aria-label="Send message"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M14 2L1 7l5 3 2 5 6-13z" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
                    <path d="M6 10l2.5-2.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
}