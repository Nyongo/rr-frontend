
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface RoutesSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const RoutesSearch = ({ searchTerm, onSearchChange }: RoutesSearchProps) => {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <Input
        placeholder="Search routes, schools, or trip types..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 w-full"
      />
    </div>
  );
};

export default RoutesSearch;
