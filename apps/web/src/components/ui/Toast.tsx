"use client";

import { useEffect } from "react";
import MaterialIcon from "@/components/icons/MaterialIcon";

interface ToastProps {
  type: 'success' | 'error';
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
}

export default function Toast({ type, message, onClose, autoClose = true }: ToastProps) {
  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose]);

  const bgColor = type === 'success' ? 'bg-accent-green' : 'bg-accent-red';
  const icon = type === 'success' ? 'check_circle' : 'error';

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] max-w-[400px] animate-in slide-in-from-top-2 fade-in-0 duration-300`}>
      <MaterialIcon name={icon} className="text-xl flex-shrink-0" />
      <p className="text-sm font-medium flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <MaterialIcon name="close" className="text-lg" />
        </button>
      )}
    </div>
  );
}
