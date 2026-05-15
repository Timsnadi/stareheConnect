/** Normalise auth payload from localStorage / outlet context. */
export function getProfile(session) {
  if (!session || typeof session !== 'object') return {}
  if (session.user && typeof session.user === 'object') return session.user
  return session
}

export function displayInitials(name) {
  if (!name || typeof name !== 'string') return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const AVC = ['teal', 'blue', 'purple', 'amber', 'coral', 'green']

export function pickAvatarVariant(seed) {
  const s = String(seed ?? 'x')
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h + s.charCodeAt(i) * 13) % 997
  return AVC[Math.abs(h) % AVC.length]
}

export function currentUserId(profile) {
  if (!profile) return null
  return profile.id ?? profile._id ?? null
}
