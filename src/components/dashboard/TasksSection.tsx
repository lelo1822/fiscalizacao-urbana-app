
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/types/dashboard";

interface TasksSectionProps {
  tasks: Task[];
}

const TasksSection = ({ tasks }: TasksSectionProps) => {
  const [completedTasks, setCompletedTasks] = React.useState<number[]>([]);

  const toggleTask = (taskId: number) => {
    setCompletedTasks((prev) => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId) 
        : [...prev, taskId]
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Tarefas do Dia</CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Nenhuma tarefa para hoje
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div 
                key={task.id}
                className="flex items-start space-x-3 p-3 rounded-lg border border-border"
              >
                <Checkbox 
                  id={`task-${task.id}`}
                  checked={completedTasks.includes(task.id)}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label 
                    htmlFor={`task-${task.id}`}
                    className={`font-medium block ${completedTasks.includes(task.id) ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {task.title}
                  </label>
                  <span className="text-sm text-muted-foreground">{task.time}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TasksSection;
