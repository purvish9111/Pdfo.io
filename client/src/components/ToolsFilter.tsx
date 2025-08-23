import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Tool {
  name: string;
  path: string;
  description: string;
  iconBg: string;
  faIcon: string;
  category: string;
}

interface ToolsFilterProps {
  tools: Tool[];
  onFilteredToolsChange: (filteredTools: Tool[]) => void;
}

const CATEGORIES = {
  ALL: 'all',
  MANIPULATION: 'manipulation',
  SECURITY: 'security', 
  OPTIMIZATION: 'optimization',
  CONVERSION_FROM_PDF: 'conversion_from_pdf',
  CONVERSION_TO_PDF: 'conversion_to_pdf',
};

const CATEGORY_LABELS = {
  [CATEGORIES.ALL]: 'All Tools',
  [CATEGORIES.MANIPULATION]: 'Manipulation',
  [CATEGORIES.SECURITY]: 'Security',
  [CATEGORIES.OPTIMIZATION]: 'Optimization', 
  [CATEGORIES.CONVERSION_FROM_PDF]: 'Convert from PDF',
  [CATEGORIES.CONVERSION_TO_PDF]: 'Convert to PDF',
};

export function ToolsFilter({ tools, onFilteredToolsChange }: ToolsFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES.ALL);
  const [showFilters, setShowFilters] = useState(false);

  // Filter tools based on search and category
  const filterTools = (query: string, category: string) => {
    let filtered = tools;

    // Filter by category
    if (category !== CATEGORIES.ALL) {
      filtered = filtered.filter(tool => tool.category === category);
    }

    // Filter by search query
    if (query.trim()) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const filtered = filterTools("", category);
    onFilteredToolsChange(filtered);
  };

  const clearFilters = () => {
    setSelectedCategory(CATEGORIES.ALL);
    onFilteredToolsChange(tools);
  };

  const hasActiveFilters = selectedCategory !== CATEGORIES.ALL;

  return (
    <div className="mb-8 space-y-4">

      {/* Filter Toggle Button */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Categories
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              1
            </span>
          )}
        </Button>
      </div>

      {/* Category Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(key)}
                className={`${
                  selectedCategory === key 
                    ? "bg-blue-500 text-white hover:bg-blue-600" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                {label}
              </Button>
            ))}
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex justify-center mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400"
              >
                <X className="h-4 w-4" />
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Active Filter Summary */}
      {hasActiveFilters && (
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          {selectedCategory !== CATEGORIES.ALL && (
            <span>Category: {CATEGORY_LABELS[selectedCategory]}</span>
          )}
        </div>
      )}
    </div>
  );
}