import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { MessageCircle, Clock, Hash, User, ShoppingCart, AlertTriangle, Tag } from "lucide-react";

interface ComplaintCardProps {
  id: string;
  title: string;
  description: string;
  status: "new" | "in-progress" | "resolved";
  date: string;
  category: string;
  subCategory?: string;
  priority?: "low" | "medium" | "high";
  customerName: string;
  orderNumber: string;
  showPriority?: boolean;
  sentimentScore?: number;
  urgencyLevel?: "low" | "medium" | "high";
  channelOfComplaint?: string;
  feedbackRating?: number;
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
  category,
  subCategory,
  priority = "medium",
  customerName,
  orderNumber,
  showPriority = false,
  sentimentScore,
  urgencyLevel,
  channelOfComplaint,
  feedbackRating,
}: ComplaintCardProps) {
  return (
    <Card className="p-6 hover:shadow-md transition-shadow bg-white border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
        <div className="flex gap-2">
          {showPriority && priority && (
            <Badge className={`${priorityColors[priority]} text-white`}>
              {priority}
            </Badge>
          )}
          <Badge className={`${statusColors[status]} text-white`}>
            {statusLabels[status]}
          </Badge>
        </div>
      </div>
      <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Hash className="h-4 w-4" />
          <span>{id}</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          <span>{category}</span>
        </div>
        {subCategory && (
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            <span>{subCategory}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{date}</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t flex flex-wrap gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <User className="h-4 w-4" />
          <span>{customerName}</span>
        </div>
        <div className="flex items-center gap-1">
          <ShoppingCart className="h-4 w-4" />
          <span>{orderNumber}</span>
        </div>
        {channelOfComplaint && (
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>via {channelOfComplaint}</span>
          </div>
        )}
        {urgencyLevel && showPriority && (
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            <span>Urgency: {urgencyLevel}</span>
          </div>
        )}
      </div>
      {(sentimentScore !== undefined || feedbackRating !== undefined) && showPriority && (
        <div className="mt-4 pt-4 border-t flex flex-wrap gap-4 text-sm text-gray-500">
          {sentimentScore !== undefined && (
            <div>
              <span className="font-medium">Sentiment Score: </span>
              <span>{sentimentScore.toFixed(2)}</span>
            </div>
          )}
          {feedbackRating !== undefined && (
            <div>
              <span className="font-medium">Feedback Rating: </span>
              <span>{feedbackRating}/5</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}