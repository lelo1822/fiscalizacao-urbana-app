
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouteHistory } from "@/hooks/useRouteHistory";
import AgentFilter from "@/components/route-history/AgentFilter";
import RouteCalendar from "@/components/route-history/RouteCalendar";
import RouteSummary from "@/components/route-history/RouteSummary";
import RouteHistoryList from "@/components/route-history/RouteHistoryList";
import { useIsMobile } from "@/hooks/use-mobile";
import BaseHeader from "@/components/shared/BaseHeader";

const RouteHistory = () => {
  const { 
    date, 
    setDate, 
    agentFilter, 
    setAgentFilter, 
    routeDays, 
    stopPoints, 
    isLoading,
    summary
  } = useRouteHistory();
  
  const isMobile = useIsMobile();

  return (
    <Layout>
      <div className="p-2 md:p-4 lg:p-8">
        <BaseHeader
          title="Histórico de Rotas"
          description="Visualize o registro de deslocamentos dos agentes"
          actions={
            <div className={`flex ${isMobile ? "flex-col w-full" : "flex-row"} gap-2 md:gap-4`}>
              <AgentFilter value={agentFilter} onChange={setAgentFilter} />
              <RouteCalendar date={date} setDate={setDate} />
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="lg:col-span-2">
            <RouteSummary
              distance={summary.distance}
              duration={summary.duration}
              occurrences={summary.occurrences}
              stopPoints={stopPoints}
            />
          </div>
          
          <div>
            <Card>
              <CardHeader className={isMobile ? "px-4 py-3" : ""}>
                <CardTitle>Histórico de Dias</CardTitle>
              </CardHeader>
              <CardContent className={isMobile ? "px-4 py-2" : ""}>
                <RouteHistoryList 
                  routeDays={routeDays}
                  selectedDate={date}
                  onSelectDate={setDate}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RouteHistory;
