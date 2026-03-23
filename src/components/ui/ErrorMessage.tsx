import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className }) => {
  if (!message) return null;
  return (
    <div className={cn("flex items-center gap-2 text-naro-red text-sm mt-2", className)}>
      <AlertCircle size={16} />
      <span>{message}</span>
    </div>
  );
};
