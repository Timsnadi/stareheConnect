import React from 'react';
import { 
  Zap, 
  UserPlus, 
  MessageCircle, 
  Award, 
  Clock 
} from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'mentor_joined',
    user: 'David Otieno',
    content: 'joined the community as a Software Engineer mentor.',
    time: '2 hours ago',
    icon: <UserPlus size={16} />,
    color: '#0F6E56'
  },
  {
    id: 2,
    type: 'mentorship_started',
    user: 'James Kamau',
    content: 'started a mentorship session with Kimathi.',
    time: '5 hours ago',
    icon: <Award size={16} />,
    color: '#d4af37'
  },
  {
    id: 3,
    type: 'profile_update',
    user: 'Brian Mutua',
    content: 'updated his target career to Data Science.',
    time: '8 hours ago',
    icon: <Zap size={16} />,
    color: '#1D9E75'
  },
  {
    id: 4,
    type: 'new_message',
    user: 'Peter Njoroge',
    content: 'posted a new career guide in the directory.',
    time: '1 day ago',
    icon: <MessageCircle size={16} />,
    color: '#ed4956'
  }
];

function DiscoveryFeed() {
  return (
    <div className="discovery-feed-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <Zap size={18} color="var(--brand-green)" />
        <h2 className="section-heading" style={{ margin: 0 }}>Discovery Feed</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="card" 
            style={{ 
              padding: '16px', 
              display: 'flex', 
              gap: '16px', 
              alignItems: 'flex-start',
              borderLeft: `4px solid ${activity.color}`
            }}
          >
            <div style={{ 
              padding: '8px', 
              borderRadius: '10px', 
              background: 'rgba(0,0,0,0.03)',
              color: activity.color
            }}>
              {activity.icon}
            </div>
            
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: '14px', margin: 0, lineHeight: '1.4' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{activity.user}</span>{' '}
                <span style={{ color: 'var(--text-secondary)' }}>{activity.content}</span>
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', color: 'var(--text-muted)', fontSize: '11px' }}>
                <Clock size={12} />
                {activity.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DiscoveryFeed;
