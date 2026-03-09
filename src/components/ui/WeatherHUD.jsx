import React from 'react'
import { useGameStore, WEATHER_TYPES } from '../../store/gameStore'

const weatherIcons = {
  sunny: '☀️',
  rain: '🌧️',
  drought: '🏜️',
  storm: '⛈️',
}

const WeatherHUD = () => {
  const weather = useGameStore(s => s.weather)
  const timeOfDay = useGameStore(s => s.timeOfDay)
  const dayCount = useGameStore(s => s.dayCount)

  const isNight = timeOfDay > 0.6 || timeOfDay < 0.1
  const timeIcon = isNight ? '🌙' : '☀️'

  const config = WEATHER_TYPES[weather]

  // Time as hours (0-24)
  const hour = Math.floor(timeOfDay * 24)
  const minutes = Math.floor((timeOfDay * 24 - hour) * 60)
  const timeStr = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

  return (
    <div className="weather-hud">
      <div className="weather-info">
        <span className="weather-icon">{weatherIcons[weather]}</span>
        <span className="weather-name">{config.name}</span>
      </div>
      <div className="time-info">
        <span>{timeIcon} {timeStr}</span>
        <span className="day-counter">Dia {dayCount}</span>
      </div>
      {config.growthMod !== 1.0 && (
        <div className="weather-effect">
          {config.growthMod > 1 ? '↑' : '↓'} Crecimiento x{config.growthMod}
        </div>
      )}
    </div>
  )
}

export default WeatherHUD
