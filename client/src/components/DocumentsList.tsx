import { DocumentCard } from "./DocumentCard";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DocumentsListProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  title?: string;
  allowPageReorder?: boolean;
}

function SortableDocumentCard({ file, onRemove, showPages, allowPageReorder, index }: {
  file: File;
  onRemove: () => void;
  showPages: boolean;
  allowPageReorder: boolean;
  index: number;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: `${file.name}-${file.size}-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <DocumentCard
        file={file}
        onRemove={onRemove}
        showPages={showPages}
        allowPageReorder={allowPageReorder}
        dragListeners={listeners}
      />
    </div>
  );
}

export function DocumentsList({ 
  files, 
  onFilesChange, 
  title = "Documents", 
  allowPageReorder = false 
}: DocumentsListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const clearAllFiles = () => {
    onFilesChange([]);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    console.log('🔄 DocumentsList drag end:', { active: active.id, over: over?.id });

    if (active.id !== over?.id && over) {
      const activeIndex = files.findIndex((file, index) => `${file.name}-${file.size}-${index}` === active.id);
      const overIndex = files.findIndex((file, index) => `${file.name}-${file.size}-${index}` === over.id);
      
      console.log('📋 Found indices:', { activeIndex, overIndex });
      
      if (activeIndex !== -1 && overIndex !== -1) {
        const newFiles = arrayMove(files, activeIndex, overIndex);
        console.log('✅ Files reordered:', newFiles.map(f => f.name));
        onFilesChange(newFiles);
      }
    }
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
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={files.map((file, index) => `${file.name}-${file.size}-${index}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {files.map((file, index) => (
              <SortableDocumentCard
                key={`${file.name}-${file.size}-${index}`}
                file={file}
                onRemove={() => removeFile(index)}
                showPages={true}
                allowPageReorder={allowPageReorder}
                index={index}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}