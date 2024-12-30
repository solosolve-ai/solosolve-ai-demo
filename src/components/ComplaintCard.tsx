import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MessageCircle, Clock, Hash } from "lucide-react";

interface ComplaintCardProps {
  id: string;
  title: string;
  description: string;
  status: "new" | "in-progress" | "resolved";
  date: string;
  category?: string;
  priority?: "low" | "medium" | "high";
}

const statusColors = {
  new: "bg-blue-500",
  "in-progress": "bg-yellow-500",
  resolved: "bg-green-500",
};

const statusLabels = {
  new: "New",
  "in-progress": "In Progress",
  resolved: "Resolved",
};

const priorityColors = {
  low: "bg-gray-500",
  medium: "bg-orange-500",
  high: "bg-red-500",
};

export function ComplaintCard({
  id,
  title,
  description,
  status,
  date,
  category = "General",
  priority = "medium",
}: ComplaintCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <div className="flex gap-2">
          {priority && (
            <Badge className={`${priorityColors[priority]} text-white`}>
              {priority}
            </Badge>
          )}
          <Badge className={`${statusColors[status]} text-white`}>
            {statusLabels[status]}
          </Badge>
        </div>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Hash className="h-4 w-4" />
          <span>{id}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          <span>{category}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{date}</span>
        </div>
      </div>
    </Card>
  );
}