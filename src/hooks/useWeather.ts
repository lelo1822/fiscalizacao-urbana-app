
import { useState, useEffect } from "react";
import { WeatherInfo } from "@/types/dashboard";

export const useWeather = () => {
  const [weatherInfo, setWeatherInfo] = useState<WeatherInfo | null>(null);
  
  useEffect(() => {
    // Mock weather data (in a real app, this would be an API call)
    setWeatherInfo({
      temp: 24,
      condition: "Parcialmente nublado",
      icon: "⛅"
    });
  }, []);

  return weatherInfo;
};
