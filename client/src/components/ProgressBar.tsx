interface ProgressBarProps {
  progress: number;
  isVisible: boolean;
  color?: string;
  className?: string;
}

export function ProgressBar({ 
  progress, 
  isVisible, 
  color = "blue", 
  className = "" 
}: ProgressBarProps) {
  if (!isVisible || progress <= 0) return null;

  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600", 
    orange: "bg-orange-600",
    purple: "bg-purple-600",
    red: "bg-red-600",
    yellow: "bg-yellow-600"
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className={`${colorClasses[color as keyof typeof colorClasses]} h-2.5 rounded-full transition-all duration-300`} 
          style={{width: `${Math.min(100, Math.max(0, progress))}%`}}
        ></div>
      </div>
      <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-2">
        {Math.round(progress)}% Complete
      </p>
    </div>
  );
}