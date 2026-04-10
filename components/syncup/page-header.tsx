"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Settings } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showSettings?: boolean;
}

export function PageHeader({ title, subtitle, onBack, showSettings }: PageHeaderProps) {
  return (
    <header className="sticky top-14 lg:top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2">
            {onBack && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 -ml-2"
                onClick={onBack}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
            )}
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-foreground">{title}</h1>
              {subtitle && (
                <p className="text-xs sm:text-sm text-muted-foreground">{subtitle}</p>
              )}
            </div>
          </div>
          {showSettings && (
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Settings className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
