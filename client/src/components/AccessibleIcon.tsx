import { cn } from "@/lib/utils";

interface AccessibleIconProps {
  icon: string;
  label?: string;
  className?: string;
  bgColor?: string;
  decorative?: boolean;
}

export function AccessibleIcon({ 
  icon, 
  label, 
  className,
  bgColor = "bg-blue-500",
  decorative = false 
}: AccessibleIconProps) {
  return (
    <div 
      className={cn(
        "w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl mx-auto mb-4",
        bgColor,
        className
      )}
      {...(!decorative && label && { 
        role: "img", 
        "aria-label": label 
      })}
      {...(decorative && { "aria-hidden": "true" })}
    >
      <i className={icon} {...(decorative && { "aria-hidden": "true" })}></i>
    </div>
  );
}