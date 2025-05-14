
import Layout from "../components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouteHistory } from "@/hooks/useRouteHistory";
import AgentFilter from "@/components/route-history/AgentFilter";
import RouteCalendar from "@/components/route-history/RouteCalendar";
import RouteSummary from "@/components/route-history/RouteSummary";
import RouteHistoryList from "@/components/route-history/RouteHistoryList";

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

  return (
    <Layout>
      <div className="p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Histórico de Rotas
            </h1>
            <p className="text-gray-500">
              Visualize o registro de deslocamentos dos agentes
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4">
            <AgentFilter value={agentFilter} onChange={setAgentFilter} />
            <RouteCalendar date={date} setDate={setDate} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
              <CardHeader>
                <CardTitle>Histórico de Dias</CardTitle>
              </CardHeader>
              <CardContent>
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
