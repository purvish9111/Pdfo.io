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
        // Check if admin subdomain is available, otherwise use route
        const currentHost = window.location.hostname;
        const adminUrl = currentHost.includes('.') 
          ? `https://admin.${currentHost.split('.').slice(-2).join('.')}`
          : '/admin';
        
        window.open(adminUrl, '_blank');
      }}
    >
      <Shield className="w-4 h-4" />
      <BarChart3 className="w-4 h-4" />
      <span>Admin Panel</span>
    </Button>
  );
}

export default AdminPanelButton;