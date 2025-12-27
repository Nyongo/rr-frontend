
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileSelectOption {
  value: string;
  label: string;
}

interface MobileSelectProps {
  options: MobileSelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
  label?: string;
}

const MobileSelect = ({
  options,
  value,
  onValueChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyText = "No options found",
  className,
  icon: Icon,
  label
}: MobileSelectProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedOption = options.find((option) => option.value === value);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    onValueChange(optionValue);
    setOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className={cn(
          "w-full justify-between h-14 text-left font-normal bg-white hover:bg-gray-50 border-gray-200 text-gray-900",
          className
        )}
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-gray-500" />}
          <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="h-full max-h-none w-full max-w-none p-0 m-0 rounded-none flex flex-col">
          {/* Header */}
          <DialogHeader className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 pb-8 rounded-b-3xl shadow-lg flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold">
                {label ? `Select ${label}` : 'Select Option'}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </DialogHeader>

          {/* Search */}
          <div className="p-6 flex-shrink-0 bg-gradient-to-br from-green-50 to-blue-50">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg bg-white border-gray-200 rounded-2xl shadow-sm"
                autoFocus
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
          </div>

          {/* Options List */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-green-50 to-blue-50">
            <div className="px-6 pb-6">
              {filteredOptions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg">{emptyText}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant="ghost"
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        "w-full h-16 justify-between text-left font-normal rounded-2xl bg-white hover:bg-green-50 border border-gray-100 shadow-sm transition-all duration-200",
                        value === option.value && "bg-green-50 border-green-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {Icon && <Icon className="w-5 h-5 text-gray-500" />}
                        <span className="text-lg text-gray-900">{option.label}</span>
                      </div>
                      {value === option.value && (
                        <Check className="w-6 h-6 text-green-600" />
                      )}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MobileSelect;
