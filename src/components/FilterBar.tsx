import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterBarProps {
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onUrgencyChange: (value: string) => void;
  onChannelChange: (value: string) => void;
  showPriorityFilter?: boolean;
}

export function FilterBar({ 
  onSearchChange, 
  onStatusChange,
  onPriorityChange,
  onCategoryChange,
  onUrgencyChange,
  onChannelChange,
  showPriorityFilter = false,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search complaints..."
          className="pl-10"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select onValueChange={onStatusChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="in-progress">In Progress</SelectItem>
          <SelectItem value="resolved">Resolved</SelectItem>
        </SelectContent>
      </Select>
      {showPriorityFilter && (
        <Select onValueChange={onPriorityChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      )}
      <Select onValueChange={onCategoryChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="Account Management">Account Management</SelectItem>
          <SelectItem value="Billing">Billing & Payments</SelectItem>
          <SelectItem value="Technical">Technical Issues</SelectItem>
          <SelectItem value="Product">Product Issues</SelectItem>
          <SelectItem value="Service">Service Issues</SelectItem>
        </SelectContent>
      </Select>
      <Select onValueChange={onChannelChange}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by channel" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Channels</SelectItem>
          <SelectItem value="web">Web</SelectItem>
          <SelectItem value="phone">Phone</SelectItem>
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="app">Mobile App</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}