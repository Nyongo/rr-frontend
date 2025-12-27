import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Plus, Import } from "lucide-react";
import { ParentsTableSection } from "./ParentsTableSection";
import { Parent } from "../types";

interface ParentsTabContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredParents: Parent[];
  loading?: boolean;
  onEditParent: (parent: Parent) => void;
  onDeleteParent: (parent: Parent) => void;
  onParentClick: (parentId: string) => void;
  onRowClick: (parent: Parent) => void;
  onAddParent: () => void;
  onImportParents: () => void;
}

export const ParentsTabContent = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  filteredParents,
  loading = false,
  onEditParent,
  onDeleteParent,
  onParentClick,
  onRowClick,
  onAddParent,
  onImportParents,
}: ParentsTabContentProps) => {
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Parents</h2>
          <p className="text-gray-600">
            Manage parent information and their students
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-300 hover:bg-gray-50"
            onClick={onImportParents}
          >
            <Import className="w-4 h-4 mr-2" />
            Import Parents
          </Button>

          <Button
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            onClick={onAddParent}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Parent
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search parents by name, email, phone, or type..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <ParentsTableSection
        parents={filteredParents}
        loading={loading}
        onEditParent={onEditParent}
        onDeleteParent={onDeleteParent}
        onParentClick={onParentClick}
        onRowClick={onRowClick}
      />
    </div>
  );
};
