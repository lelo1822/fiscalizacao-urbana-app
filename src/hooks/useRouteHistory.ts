
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { format, subDays } from "date-fns";

export interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface RouteDay {
  date: string;
  points: number;
  distance: string;
  duration: string;
}

export interface StopPoint {
  id: number;
  location: string;
  timeRange: string;
  duration: string;
  type: string;
}

export const useRouteHistory = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [agentFilter, setAgentFilter] = useState("all");
  const [routeHistory, setRouteHistory] = useState<LocationPoint[]>([]);
  const [routeDays, setRouteDays] = useState<RouteDay[]>([]);
  const [selectedRoutePoints, setSelectedRoutePoints] = useState<LocationPoint[]>([]);
  const [stopPoints, setStopPoints] = useState<StopPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load route history when date changes
  useEffect(() => {
    if (!date) return;
    
    const loadRouteData = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would fetch data from the server
        // For demonstration, we'll use simulated data
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulating network delay
        
        // Generate simulated route points based on date
        const seed = date.getDate() + date.getMonth();
        const pointCount = 80 + seed % 40; // Between 80 and 120 points
        
        const simulatedPoints: LocationPoint[] = [];
        const baseTimestamp = new Date(date);
        baseTimestamp.setHours(8, 0, 0, 0); // Start at 8am
        
        // Base coordinates (São Paulo)
        const baseLat = -23.55052;
        const baseLng = -46.63308;
        
        for (let i = 0; i < pointCount; i++) {
          // Create a trajectory with some variation
          const progress = i / (pointCount - 1);
          const radius = 0.02 * Math.sin(progress * Math.PI); // Maximum variation of 0.02 degrees
          const angle = progress * 12 * Math.PI + seed; // Angle varying based on date
          
          const point = {
            latitude: baseLat + radius * Math.cos(angle) + (Math.random() - 0.5) * 0.001,
            longitude: baseLng + radius * Math.sin(angle) + (Math.random() - 0.5) * 0.001,
            timestamp: baseTimestamp.getTime() + i * 2 * 60 * 1000 // 2 minutes between points
          };
          
          simulatedPoints.push(point);
        }
        
        // Generate simulated stop points
        const stops: StopPoint[] = [
          {
            id: 1,
            location: "Rua das Flores, 123",
            timeRange: "10:15 - 10:35",
            duration: "20min",
            type: "Buraco na via"
          },
          {
            id: 2,
            location: "Av. Principal, 456",
            timeRange: "11:20 - 11:50",
            duration: "30min",
            type: "Poda de árvore"
          },
          {
            id: 3,
            location: "Praça Central",
            timeRange: "14:05 - 14:20",
            duration: "15min",
            type: "Lâmpada queimada"
          }
        ];
        
        setSelectedRoutePoints(simulatedPoints);
        setStopPoints(stops);
      } catch (err) {
        console.error("Error loading data:", err);
        toast({
          title: "Erro",
          description: "Erro ao carregar dados da rota",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRouteData();
  }, [date]);
  
  // Load general history of days
  useEffect(() => {
    const storageKey = `locationHistory_${user?.id || 'anonymous'}`;
    const storedHistory = localStorage.getItem(storageKey);
    
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        setRouteHistory(parsedHistory);
      } catch (err) {
        console.error("Error parsing location history:", err);
      }
    }
    
    // Generate simulated route days
    const mockRouteDays: RouteDay[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const routeDate = subDays(today, i);
      
      // Use the day as a seed for consistent but varied values
      const seed = routeDate.getDate() + routeDate.getMonth();
      const distance = (3 + (seed % 8) + Math.random() * 2).toFixed(1);
      const hours = 1 + (seed % 5);
      const minutes = seed % 60;
      
      mockRouteDays.push({
        date: format(routeDate, 'yyyy-MM-dd'),
        points: Math.floor(30 + seed % 50),
        distance: `${distance} km`,
        duration: `${hours}h ${minutes}min`,
      });
    }
    
    setRouteDays(mockRouteDays);
  }, [user?.id]);

  // Calculate metrics for the selected route
  const getRouteSummary = () => {
    if (selectedRoutePoints.length < 2) {
      return { distance: "0 km", duration: "0h 00min", occurrences: 0 };
    }
    
    // Calculate total distance (in a real app, this would be more accurate)
    const distanceInKm = (selectedRoutePoints.length * 0.05).toFixed(1);
    
    // Calculate duration
    const startTime = new Date(selectedRoutePoints[0].timestamp);
    const endTime = new Date(selectedRoutePoints[selectedRoutePoints.length - 1].timestamp);
    const durationMs = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return {
      distance: `${distanceInKm} km`,
      duration: `${hours}h ${minutes}min`,
      occurrences: stopPoints.length
    };
  };

  return {
    date,
    setDate,
    agentFilter,
    setAgentFilter,
    routeHistory,
    routeDays,
    selectedRoutePoints,
    stopPoints,
    isLoading,
    summary: getRouteSummary()
  };
};
