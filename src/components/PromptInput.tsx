
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowUp, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";

interface PromptInputProps {
  placeholder?: string;
  onSubmit?: (value: string, files?: FileList) => void;
  onChange?: (value: string) => void;
  onFileUpload?: (files: FileList) => void;
  disabled?: boolean;
  className?: string;
}

export const PromptInput = React.forwardRef<HTMLDivElement, PromptInputProps>(
  ({ placeholder = "Type your message...", onSubmit, onChange, onFileUpload, disabled = false, className }, ref) => {
    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (value.trim() && onSubmit) {
        onSubmit(value.trim());
        setValue("");
      }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      if (onChange) {
        onChange(newValue);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (value.trim() && onSubmit) {
          onSubmit(value.trim());
          setValue("");
        }
      }
    };

    const handleFileUpload = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0 && onFileUpload) {
        onFileUpload(files);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full max-w-2xl mx-auto items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary",
          className
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleFileUpload}
          disabled={disabled}
          className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
        >
          <Paperclip size={16} />
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
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button
            type="submit"
            size="icon"
            disabled={disabled || !value.trim()}
            className="h-7 w-7 shrink-0"
          >
            <ArrowUp size={16} />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    );
  }
);

PromptInput.displayName = "PromptInput";
