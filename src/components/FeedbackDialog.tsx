
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Star } from "lucide-react";

interface FeedbackDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (rating: number, feedback?: string) => void;
}

export const FeedbackDialog: React.FC<FeedbackDialogProps> = ({ isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [hoveredRating, setHoveredRating] = useState<number>(0);

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating, feedback);
      onClose();
      setRating(0);
      setFeedback("");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/95 backdrop-blur border border-purple-300 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-purple-900">
            האם עניתי לך על הבעיה?
          </DialogTitle>
          <DialogDescription className="text-center text-purple-700">
            דרג את איכות הפתרון מ-1 עד 10
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Star Rating */}
          <div className="flex justify-center space-x-1 rtl:space-x-reverse">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-colors hover:scale-110 transform"
              >
                <Star
                  size={24}
                  className={`${
                    star <= (hoveredRating || rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          
          {/* Rating Number Display */}
          <div className="text-center">
            <span className="text-2xl font-bold text-purple-900">
              {rating > 0 ? rating : '-'}/10
            </span>
          </div>

          {/* Optional Feedback */}
          <div>
            <label className="block text-sm font-medium text-purple-900 mb-2">
              הערות נוספות (אופציונלי)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="איך יכולנו לעזור לך יותר טוב?"
              className="w-full p-3 border border-purple-300 rounded-lg bg-white/50 text-purple-900 placeholder:text-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
              dir="rtl"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              ביטול
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
            >
              שלח דירוג
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
