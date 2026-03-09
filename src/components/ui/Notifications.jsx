import React, { useEffect } from 'react'
import { useGameStore } from '../../store/gameStore'

const Notifications = () => {
  const notifications = useGameStore(s => s.notifications)
  const clearNotification = useGameStore(s => s.clearNotification)

  useEffect(() => {
    if (notifications.length === 0) return
    const latest = notifications[notifications.length - 1]
    const timer = setTimeout(() => clearNotification(latest.id), 3000)
    return () => clearTimeout(timer)
  }, [notifications, clearNotification])

  return (
    <div className="notifications">
      {notifications.map(n => (
        <div key={n.id} className={`notification ${n.type}`}>
          {n.message}
        </div>
      ))}
    </div>
  )
}

export default Notifications
