"use client"

import { useState, useEffect } from "react"

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState("India") // Default location

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true)
      try {
        // This is a mock API call since we don't have a real API key
        // In a real app, you would use a weather API like OpenWeatherMap
        // const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=YOUR_API_KEY&units=metric`;

        // Simulating API response with mock data
        setTimeout(() => {
          const mockWeatherData = {
            temp: Math.floor(Math.random() * 30) + 5, // Random temp between 5-35°C
            condition: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][Math.floor(Math.random() * 4)],
            humidity: Math.floor(Math.random() * 50) + 30, // Random humidity between 30-80%
            location: location,
          }
          setWeather(mockWeatherData)
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching weather:", error)
        setLoading(false)
      }
    }

    fetchWeather()
  }, [location])

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case "Sunny":
        return "☀️"
      case "Cloudy":
        return "☁️"
      case "Rainy":
        return "🌧️"
      case "Partly Cloudy":
        return "⛅"
      default:
        return "🌡️"
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 flex items-center space-x-3 text-sm">
      {loading ? (
        <div className="animate-pulse flex items-center space-x-2">
          <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-3 w-16 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      ) : weather ? (
        <>
          <span className="text-2xl" aria-hidden="true">
            {getWeatherIcon(weather.condition)}
          </span>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{weather.temp}°C</div>
            <div className="text-gray-600 dark:text-gray-400 text-xs">{weather.location}</div>
          </div>
        </>
      ) : (
        <div className="text-gray-600 dark:text-gray-400">Weather unavailable</div>
      )}
    </div>
  )
}

export default WeatherWidget
