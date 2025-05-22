
import { useState } from "react";
import { Report } from "@/types/dashboard";

export const useUserLocation = () => {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [nearbyReports, setNearbyReports] = useState<Report[]>([]);

  return { userPosition, nearbyReports };
};
