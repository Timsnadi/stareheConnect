import { useLocation, useNavigate, useOutletContext } from 'react-router-dom'
import ChatSystem from '../components/ChatSystem'

export default function Messages() {
  const { userSession } = useOutletContext()
  const navigate = useNavigate()
  const location = useLocation()
  const initialTarget = location.state?.startChatWith ?? null

  return (
    <ChatSystem
      user={userSession}
      initialTarget={initialTarget}
      onBack={() => navigate('/feed')}
    />
  )
}
