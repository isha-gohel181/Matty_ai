// frontend/src/components/Editor/ImageFilters.jsx
import React from "react";
import { Button } from "@/components/ui/button";

const ImageFilters = ({ onFilterChange }) => {
  const filters = ["grayscale", "sepia", "none"];

  return (
    <div className="absolute top-20 left-4 bg-background p-2 rounded-lg border shadow-md flex flex-col gap-2">
       <p className="text-sm font-medium text-center">Image Filters</p>
      {filters.map((filter) => (
        <Button
          key={filter}
          variant="outline"
          size="sm"
          onClick={() => onFilterChange(filter)}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </Button>
      ))}
    </div>
  );
};

export default ImageFilters;