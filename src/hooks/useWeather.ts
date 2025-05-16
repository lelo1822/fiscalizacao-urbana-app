
import { useState, useEffect } from "react";
import { WeatherInfo } from "@/types/dashboard";

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Mock weather data for demonstration
        // In a real app, this would be an API call to a weather service
        setTimeout(() => {
          setWeatherData({
            temperature: 27,
            condition: "Ensolarado",
            icon: "☀️",
            city: "São Paulo"
          });
          setLoading(false);
        }, 1000);
      } catch (e) {
        setError("Erro ao carregar dados meteorológicos");
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return { weatherData, loading, error };
};

export default useWeather;
