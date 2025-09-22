
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Link as LinkIcon, Zap } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

interface CreateTaskOutput {
  taskId: string;
  shortenedUrl: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<CreateTaskOutput[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGetTasks = async () => {
    setIsLoading(true);
    setTasks([]);

    try {
      const taskPromises = Array.from({ length: 5 }, async () => {
        const response = await fetch('/api/create-task', {
          method: 'POST',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Request to create task failed.");
        }

        return response.json();
      });
      
      const newTasks = await Promise.all(taskPromises);
      setTasks(newTasks);
    } catch (error: any) {
      console.error("Failed to create tasks:", error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể tạo nhiệm vụ. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Nhiệm vụ hàng ngày</h1>
        <Button onClick={handleGetTasks} disabled={isLoading} size="lg">
          <Zap className="mr-2 h-5 w-5" />
          {isLoading ? 'Đang tải...' : 'Nhận 5 nhiệm vụ'}
        </Button>
      </div>

      <div className="mt-8">
        {tasks.length === 0 && !isLoading ? (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Chưa có nhiệm vụ nào.</p>
            <p className="text-muted-foreground">Bấm "Nhận 5 nhiệm vụ" để bắt đầu.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task, index) => (
              <Card
                key={task.taskId}
                className="animate-in fade-in-0 zoom-in-95"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LinkIcon className="h-5 w-5 text-primary" />
                    <span>Nhiệm vụ #{task.taskId}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground break-all">{task.shortenedUrl}</p>
                  <Button asChild variant="secondary" className="mt-4 w-full">
                    <Link href={task.shortenedUrl} target="_blank" rel="noopener noreferrer">
                      Hoàn thành <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
             {isLoading && Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="p-4 bg-card rounded-lg border">
                    <div className="h-8 w-1/2 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 w-full bg-muted rounded mt-4 animate-pulse"></div>
                    <div className="h-10 w-full bg-muted rounded mt-4 animate-pulse"></div>
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
