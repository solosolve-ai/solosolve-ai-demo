
import React from 'react';
import { CheckCircle2, Circle, CircleAlert, CircleDotDashed, CircleX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface AgentTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'need-help' | 'failed';
  tools?: string[];
}

interface AIAgentProgressProps {
  tasks: AgentTask[];
  className?: string;
}

export const AIAgentProgress: React.FC<AIAgentProgressProps> = ({ tasks, className }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <CircleDotDashed className="h-4 w-4 text-blue-500 animate-pulse" />;
      case 'need-help':
        return <CircleAlert className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <CircleX className="h-4 w-4 text-red-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'need-help':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className={`bg-white rounded-lg border p-4 space-y-3 ${className}`}>
      <h3 className="text-sm font-semibold text-gray-900 mb-3">AI Agent Progress</h3>
      <AnimatePresence>
        {tasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50"
          >
            <div className="mt-0.5">
              {getStatusIcon(task.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {task.title}
                </p>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                  {task.status}
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{task.description}</p>
              {task.tools && task.tools.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {task.tools.map((tool, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-200 text-gray-700 px-2 py-0.5 text-xs rounded"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
