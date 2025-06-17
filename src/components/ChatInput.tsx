import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Paperclip } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string, files?: FileList) => void;
  isLoading: boolean;
  onFileUpload?: (files: FileList) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading, onFileUpload }) => {
  const [message, setMessage] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage("");
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      if (onFileUpload) {
        onFileUpload(files);
      }
      if (onSendMessage && message.trim()) {
        onSendMessage(message.trim(), files);
        setMessage("");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-t bg-white">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleFileUpload}
        disabled={isLoading}
        className="self-end"
      >
        <Paperclip className="h-4 w-4" />
        <span className="sr-only">Upload file</span>
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept="image/*,.pdf,.doc,.docx,.txt"
        multiple
        className="hidden"
      />
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Describe your complaint..."
        className="flex-1 min-h-[60px] resize-none"
        disabled={isLoading}
      />
      <Button
        type="submit"
        disabled={!message.trim() || isLoading}
        className="self-end"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </Button>
    </form>
  );
};
