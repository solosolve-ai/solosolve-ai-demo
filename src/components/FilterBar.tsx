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
}

export function FilterBar({ onSearchChange, onStatusChange }: FilterBarProps) {
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
    </div>
  );
}