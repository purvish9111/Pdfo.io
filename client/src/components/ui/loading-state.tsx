import { Loader2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
  variant?: "default" | "tool" | "pdf" | "minimal";
  text?: string;
}

export function LoadingState({ 
  className, 
  variant = "default", 
  text 
}: LoadingStateProps) {
  const variants = {
    default: {
      container: "flex items-center justify-center min-h-[400px]",
      icon: <Loader2 className="h-8 w-8 animate-spin text-blue-600" />,
      text: text || "Loading...",
    },
    tool: {
      container: "flex items-center justify-center min-h-[400px]",
      icon: <Loader2 className="h-8 w-8 animate-spin text-blue-600" />,
      text: text || "Loading tool...",
    },
    pdf: {
      container: "absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700",
      icon: <FileText className="h-6 w-6 text-gray-400" />,
      text: text || "Loading PDF...",
    },
    minimal: {
      container: "flex items-center justify-center py-4",
      icon: <Loader2 className="h-5 w-5 animate-spin text-gray-500" />,
      text: text || "Loading...",
    },
  };

  const config = variants[variant];

  return (
    <div className={cn(config.container, className)}>
      <div className="flex flex-col items-center space-y-4">
        {config.icon}
        {config.text && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {config.text}
          </p>
        )}
      </div>
    </div>
  );
}