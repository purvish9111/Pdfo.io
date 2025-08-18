import React from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, Shield } from "lucide-react";

interface AdminPanelButtonProps {
  className?: string;
}

export function AdminPanelButton({ className = "" }: AdminPanelButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      className={`hidden lg:flex items-center space-x-2 ${className}`}
      onClick={() => {
        // Navigate to admin panel
        window.open('/purvish_tools', '_blank');
      }}
    >
      <Shield className="w-4 h-4" />
      <BarChart3 className="w-4 h-4" />
      <span>Admin Panel</span>
    </Button>
  );
}

export default AdminPanelButton;