
import { useState, useEffect } from "react";
import { Report } from "@/types/dashboard";

export const useUserLocation = (recentReports: Report[]) => {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [nearbyIssues, setNearbyIssues] = useState<Report[]>([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);
          
          // Mock: Find nearby issues (simulation)
          const mockNearby = recentReports
            .filter(issue => Math.random() > 0.5) // Simulating distance
            .slice(0, 2);
          setNearbyIssues(mockNearby);
        },
        (error) => {
          console.error("Erro ao obter localização:", error);
        }
      );
    }
  }, [recentReports]);

  return { userPosition, nearbyIssues };
};
