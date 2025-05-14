
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/types/dashboard";

interface TasksSectionProps {
  taskList: Task[];
  onTaskToggle: (taskId: number) => void;
}

const TasksSection = ({ taskList, onTaskToggle }: TasksSectionProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle>Tarefas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {taskList.map((task) => (
            <div key={task.id} className="flex items-start space-x-2">
              <Checkbox 
                id={`task-${task.id}`}
                checked={task.completed}
                onCheckedChange={() => onTaskToggle(task.id)}
                className="mt-1"
              />
              <div className="grid gap-1 leading-none">
                <label
                  htmlFor={`task-${task.id}`}
                  className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                    task.completed ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {task.title}
                </label>
                <p className="text-xs text-muted-foreground">{task.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TasksSection;
