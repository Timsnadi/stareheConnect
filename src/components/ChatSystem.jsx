import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'

// In production, this would be your Render URL
const SOCKET_URL = 'http://localhost:5000'

function ChatSystem({ user, initialTarget, onBack }) {
  const [socket, setSocket] = useState(null)
  const [contacts, setContacts] = useState([])
  const [selectedContact, setSelectedContact] = useState(initialTarget || null)
  const [messages, setMessages] = useState({})
  const [inputText, setInputText] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    const newSocket = io(SOCKET_URL)
    setSocket(newSocket)

    newSocket.emit('join_room', user.id)

    newSocket.on('receive_message', (data) => {
      // data: { senderId, text, time }
      setMessages(prev => {
        const contactId = data.senderId
        return {
          ...prev,
          [contactId]: [...(prev[contactId] || []), { ...data, sender: data.senderName }]
        }
      })
    })

    return () => newSocket.close()
  }, [user.id])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, selectedContact])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputText.trim() || !selectedContact) return

    const messageData = {
      senderId: user.id,
      senderName: user.name,
      receiverId: selectedContact._id || selectedContact.id,
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    socket.emit('send_message', messageData)

    setMessages(prev => {
      const contactId = messageData.receiverId
      return {
        ...prev,
        [contactId]: [...(prev[contactId] || []), { ...messageData, sender: 'You' }]
      }
    })
    setInputText('')
  }

  const activeMessages = selectedContact ? (messages[selectedContact._id || selectedContact.id] || []) : []

  return (
    <div className="chat-system animate-fade-in" style={{ 
      height: 'calc(100vh - 65px)', 
      display: 'grid', 
      gridTemplateColumns: window.innerWidth > 768 ? '300px 1fr' : '1fr',
      background: 'var(--bg-main)'
    }}>
      {/* Contact List (Simplified for now) */}
      {(!selectedContact || window.innerWidth > 768) && (
        <div style={{ borderRight: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between' }}>
            <h2 className="premium-font" style={{ fontSize: '1.2rem' }}>Messages</h2>
            <button className="btn btn-secondary" style={{ padding: '4px 8px', minHeight: '30px', fontSize: '0.7rem' }} onClick={onBack}>Back</button>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {selectedContact && (
              <div style={{ padding: '16px 20px', background: 'var(--bg-card)', borderBottom: '1px solid var(--glass-border)' }}>
                <h4 className="premium-font" style={{ fontSize: '0.95rem' }}>{selectedContact.name}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--success)' }}>Active Chat</p>
              </div>
            )}
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Select a mentor or student from the directory to start chatting.
            </div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {selectedContact && (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-main)' }}>
          <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--nav-bg)' }}>
            {window.innerWidth <= 768 && (
              <button className="btn btn-secondary" style={{ padding: '4px 10px', minHeight: '36px' }} onClick={() => setSelectedContact(null)}>←</button>
            )}
            <div>
              <h3 className="premium-font" style={{ fontSize: '1rem' }}>{selectedContact.name}</h3>
              <span style={{ fontSize: '0.7rem', color: 'var(--success)' }}>● Real-time Connection</span>
            </div>
          </div>

          <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activeMessages.map((msg, i) => (
              <div key={i} style={{ alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                <div style={{ padding: '10px 16px', background: msg.sender === 'You' ? 'var(--primary)' : 'var(--bg-card)', color: 'white', borderRadius: '12px', fontSize: '0.9rem' }}>
                  <p>{msg.text}</p>
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block', textAlign: msg.sender === 'You' ? 'right' : 'left' }}>{msg.time}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} style={{ padding: '16px', borderTop: '1px solid var(--glass-border)', background: 'var(--bg-card)' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                placeholder="Type your message..." 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                style={{ flex: 1, padding: '12px' }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '0 20px' }}>Send</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default ChatSystem
