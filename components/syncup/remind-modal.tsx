"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, CheckCircle2 } from "lucide-react";

interface RemindModalProps {
  isOpen: boolean;
  recipientName: string;
  itemName: string;
  onClose: () => void;
  onSend: (message: string) => void;
}

export function RemindModal({ 
  isOpen, 
  recipientName, 
  itemName, 
  onClose, 
  onSend 
}: RemindModalProps) {
  const defaultMessage = `Hey! Just a friendly reminder that ${itemName.toLowerCase()} still needs to be completed for our trip. Let me know if you need any help!`;
  const [message, setMessage] = useState(defaultMessage);
  const [sent, setSent] = useState(false);

  if (!isOpen) return null;

  const handleSend = () => {
    onSend(message);
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setMessage(defaultMessage);
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setMessage(defaultMessage);
    setSent(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <Card className="relative z-10 w-full max-w-md mx-4 p-6 shadow-xl">
        {sent ? (
          // Confirmation state
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-lg text-foreground mb-2">Reminder sent!</h3>
            <p className="text-sm text-muted-foreground">
              {recipientName} will be notified
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg text-foreground">Send reminder</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  To: {recipientName}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 -mr-2 -mt-1"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Message */}
            <div className="mb-4">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-32 p-3 text-sm border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
                placeholder="Write your reminder message..."
              />
              <p className="text-xs text-muted-foreground mt-1.5 text-right">
                {message.length} characters
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1"
                onClick={handleSend}
                disabled={!message.trim()}
              >
                Send reminder
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
