
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  time: string;
}

interface TasksSectionProps {
  initialTasks: Task[];
}

const TasksSection = ({ initialTasks }: TasksSectionProps) => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState(initialTasks);

  // Marcar tarefa como concluída com feedback visual
  const toggleTaskCompleted = (taskId: number) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = !task.completed;
        
        // Mostrar toast confirmando a ação
        toast({
          title: newStatus ? "Tarefa concluída" : "Tarefa reaberta",
          description: newStatus ? "A tarefa foi marcada como concluída." : "A tarefa foi marcada como pendente.",
          variant: newStatus ? "default" : "destructive",
        });
        
        return { ...task, completed: newStatus };
      }
      return task;
    }));
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle>Tarefas do Dia</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className={`flex items-center justify-between p-3 border rounded-md ${
                task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
              } transition-colors duration-200 hover:border-primary/30`}
            >
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  className={`h-6 w-6 rounded-full p-0 ${
                    task.completed ? 'bg-primary text-white' : 'bg-transparent text-gray-400'
                  }`}
                  onClick={() => toggleTaskCompleted(task.id)}
                >
                  {task.completed && <Check className="h-3 w-3" />}
                </Button>
                <div>
                  <p className={`font-medium ${task.completed ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-500">{task.time}</p>
                </div>
              </div>
            </div>
          ))}
          
          {tasks.filter(t => !t.completed).length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-4">
              Todas as tarefas foram concluídas! 🎉
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TasksSection;
