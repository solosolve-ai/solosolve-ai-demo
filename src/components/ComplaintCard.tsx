import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface ComplaintCardProps {
  title: string;
  description: string;
  status: "new" | "in-progress" | "resolved";
  date: string;
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

export function ComplaintCard({ title, description, status, date }: ComplaintCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg">{title}</h3>
        <Badge className={`${statusColors[status]} text-white`}>
          {statusLabels[status]}
        </Badge>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="text-sm text-gray-500">{date}</div>
    </Card>
  );
}