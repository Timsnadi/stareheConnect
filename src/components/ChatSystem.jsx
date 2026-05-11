import React, { useState, useEffect, useRef, useMemo } from 'react'
import axios from 'axios'
import io from 'socket.io-client'
import { 
  Send, 
  Search, 
  MoreVertical, 
  Trash2, 
  X,
  MessageSquare,
  ArrowLeft
} from 'lucide-react'

const API_URL = 'http://localhost:5000/api'
const SOCKET_URL = 'http://localhost:5000'

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatTime(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

function groupMessagesByDate(messages) {
  const groups = {}
  messages.forEach(m => {
    const date = new Date(m.createdAt).toLocaleDateString()
    if (!groups[date]) groups[date] = []
    groups[date].push(m)
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
        <span style={{ position: "absolute", bottom: 0, right: 0, width: size * 0.25, height: size * 0.25, borderRadius: "50%", background: "#1D9E75", border: "2px solid var(--bg-surface)" }} />
      )}
    </div>
  );
}

// ── ChatSystem Component ───────────────────────────────────────────────────────
function ChatSystem({ user, initialTarget, onBack }) {
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [socket, setSocket] = useState(null)
  
  const messagesEndRef = useRef(null)
  const lastTargetIdRef = useRef(null)

  const authToken = user?.token
  const currentUserData = user?.user || user
  const currentUserId = currentUserData?.id || currentUserData?._id

  const config = useMemo(() => ({
    headers: { 'Authorization': `Bearer ${authToken}` }
  }), [authToken])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const fetchMessages = async (conversationId) => {
    try {
      const res = await axios.get(`${API_URL}/messages/${conversationId}`, config)
      setMessages(res.data)
    } catch (err) {
      console.error('Error fetching messages:', err)
    }
  }

  // Socket setup
  useEffect(() => {
    if (!currentUserId) return
    const newSocket = io(SOCKET_URL)
    setSocket(newSocket)
    
    newSocket.emit('join', { userId: currentUserId })
    
    newSocket.on('receive_message', (message) => {
      // Add message if it's for the current conversation
      if (activeConversation?._id === message.conversationId) {
        setMessages(prev => [...prev, message])
      }
      
      // Update sidebar preview
      setConversations(prev => prev.map(c => 
        c._id === message.conversationId 
        ? { ...c, lastMessage: { content: message.content, createdAt: message.createdAt, senderId: message.senderId } }
        : c
      ).sort((a, b) => {
        const aDate = a.lastMessage?.createdAt || 0
        const bDate = b.lastMessage?.createdAt || 0
        return new Date(bDate) - new Date(aDate)
      }))
    })

    return () => newSocket.disconnect()
  }, [currentUserId, activeConversation?._id])

  // Initial Data Load
  useEffect(() => {
    const initializeChat = async () => {
      if (!authToken) return
      
      const targetId = initialTarget?._id || initialTarget?.id;
      if (targetId && lastTargetIdRef.current === targetId) return;
      lastTargetIdRef.current = targetId;

      try {
        const res = await axios.get(`${API_URL}/conversations`, config)
        setConversations(res.data)

        if (initialTarget) {
          let existing = res.data.find(c => c.participants.some(p => p._id === targetId))
          
          if (!existing) {
            const startRes = await axios.post(`${API_URL}/conversations`, {
              participantId: targetId
            }, config)
            existing = startRes.data
            setConversations(prev => [existing, ...prev])
          }
          setActiveConversation(existing)
          fetchMessages(existing._id)
        }
      } catch (err) {
        console.error('Chat init error:', err)
      } finally {
        setLoading(false)
      }
    }
    initializeChat()
  }, [currentUserId, initialTarget, config, authToken])

  const sendMessage = async () => {
    if (!inputText.trim() || !activeConversation) return
    try {
      // 1. Save to DB
      const res = await axios.post(`${API_URL}/messages`, {
        conversationId: activeConversation._id,
        content: inputText
      }, config)
      
      const savedMsg = res.data
      
      // 2. Add to local state
      setMessages(prev => [...prev, savedMsg])
      
      // 3. Emit via socket
      const otherUser = activeConversation.participants.find(p => p._id !== currentUserId)
      socket.emit('send_message', {
        ...savedMsg,
        receiverId: otherUser?._id
      })
      
      setInputText('')
      scrollToBottom()
    } catch (err) {
      console.error('Send error:', err)
    }
  }

  const deleteConversation = async (id) => {
    if (!window.confirm('Delete this entire conversation?')) return
    try {
      await axios.delete(`${API_URL}/conversations/${id}`, config)
      setConversations(prev => prev.filter(c => c._id !== id))
      if (activeConversation?._id === id) {
        setActiveConversation(null)
        setMessages([])
      }
    } catch (err) {
      console.error('Delete conv error:', err)
    }
  }

  const filteredConversations = conversations.filter(c => {
    const other = c.participants.find(p => p._id !== currentUserId)
    return other?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const groupedMessages = useMemo(() => groupMessagesByDate(messages), [messages])

  return (
    <div className="chat-container animate-fade-in">
      <style>{`
        @media (max-width: 1024px) {
          .chat-sidebar-mobile { display: ${activeConversation ? 'none' : 'flex'} !important; width: 100% !important; }
          .chat-window-mobile { display: ${activeConversation ? 'flex' : 'none'} !important; width: 100% !important; }
          .mobile-back-btn { display: flex !important; }
        }
      `}</style>

      {/* ── Conversation List ── */}
      <div className="chat-sidebar-mobile" style={{ width: '320px', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', background: 'var(--bg-surface-elevated)' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <button className="mobile-back-btn btn-secondary" style={{ display: 'none', padding: '8px' }} onClick={onBack}>
              <ArrowLeft size={18} />
            </button>
            <h2 className="section-heading" style={{ margin: 0 }}>Messages</h2>
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              placeholder="Search chats..." 
              style={{ paddingLeft: '36px', background: 'var(--bg-page)', border: 'none' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredConversations.map(conv => {
            const otherUser = conv.participants.find(p => p._id !== currentUserId)
            const isActive = activeConversation?._id === conv._id
            const preview = conv.lastMessage
              ? conv.lastMessage.content.slice(0, 45) + (conv.lastMessage.content.length > 45 ? '…' : '')
              : '';
            
            return (
              <div 
                key={conv._id}
                onClick={() => { setActiveConversation(conv); fetchMessages(conv._id); }}
                style={{ 
                  padding: '16px 24px', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  gap: '12px', 
                  alignItems: 'center',
                  background: isActive ? 'rgba(15, 110, 86, 0.08)' : 'transparent',
                  borderLeft: isActive ? '4px solid var(--brand-green)' : '4px solid transparent',
                  transition: 'all 0.2s'
                }}
              >
                <Avatar name={otherUser?.name} size={44} />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <h4 className="card-title" style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{otherUser?.name}</h4>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                      {conv.lastMessage ? formatTime(conv.lastMessage.createdAt) : ''}
                    </span>
                  </div>
                  <p className="card-meta" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                    {preview}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Chat Window ── */}
      <div className="chat-window-mobile" style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-page)' }}>
        {activeConversation ? (
          <>
            <div style={{ padding: '16px 24px', background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button className="mobile-back-btn btn-secondary" style={{ display: 'none', padding: '8px' }} onClick={() => setActiveConversation(null)}>
                  <ArrowLeft size={18} />
                </button>
                <Avatar name={activeConversation.participants.find(p => p._id !== currentUserId)?.name} online={true} />
                <div>
                  <h3 className="card-title">{activeConversation.participants.find(p => p._id !== currentUserId)?.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1D9E75' }} />
                    <span className="card-meta">Online</span>
                  </div>
                </div>
              </div>
              <button className="btn-secondary" style={{ padding: '8px' }} onClick={() => deleteConversation(activeConversation._id)}>
                <Trash2 size={18} color="var(--secondary)" />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', background: 'var(--bg-surface)', padding: '4px 12px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      {date}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {msgs.map(m => {
                      const isMe = m.senderId === currentUserId
                      return (
                        <div key={m._id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                          <div style={{ 
                            padding: '12px 16px', 
                            borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                            background: isMe ? 'var(--brand-green)' : 'var(--bg-surface)',
                            color: isMe ? 'white' : 'var(--text-primary)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            border: isMe ? 'none' : '1px solid var(--border)'
                          }}>
                            <p style={{ fontSize: '14px', margin: 0 }}>{m.content}</p>
                          </div>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px', textAlign: isMe ? 'right' : 'left' }}>
                            {formatTime(m.createdAt || m.timestamp)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ padding: '24px', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input 
                  placeholder="Type a message..." 
                  style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', background: 'var(--bg-page)', border: '1px solid var(--border)' }}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                />
                <button className="btn-primary" onClick={sendMessage} style={{ padding: '12px 24px' }}>
                  <Send size={18} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '40px', opacity: 0.7 }}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="8" width="28" height="20" rx="4" stroke="#d1d5db" strokeWidth="1.5" fill="none"/>
              <path d="M12 28l-4 4v-4" stroke="#d1d5db" strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
              <circle cx="14" cy="18" r="1.5" fill="#d1d5db"/>
              <circle cx="20" cy="18" r="1.5" fill="#d1d5db"/>
              <circle cx="26" cy="18" r="1.5" fill="#d1d5db"/>
            </svg>
            <p style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>Select a conversation</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, textAlign: 'center' }}>Choose someone from the list to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatSystem