import { DocumentCard } from "./DocumentCard";

interface DocumentsListProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  title?: string;
  allowPageReorder?: boolean;
}

export function DocumentsList({ 
  files, 
  onFilesChange, 
  title = "Documents", 
  allowPageReorder = false 
}: DocumentsListProps) {
  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const clearAllFiles = () => {
    onFilesChange([]);
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title} ({files.length})
        </h3>
        <button
          onClick={clearAllFiles}
          className="text-sm text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
        >
          Clear All
        </button>
      </div>
      
      <div className="space-y-3">
        {files.map((file, index) => (
          <DocumentCard
            key={`${file.name}-${file.size}-${index}`}
            file={file}
            onRemove={() => removeFile(index)}
            showPages={true}
            allowPageReorder={allowPageReorder}
          />
        ))}
      </div>
    </div>
  );
}