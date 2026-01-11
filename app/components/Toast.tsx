import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = "success", duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div 
      className={`
        fixed top-5 right-5 z-[10000]
        flex items-center gap-3
        px-6 py-4 rounded-lg shadow-lg
        text-white font-medium
        transition-all duration-300 ease-in-out
        ${type === "success" ? "bg-green-600" : "bg-red-600"}
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"}
      `}
    >
      <span className="text-xl">
        {type === "success" ? "✓" : "✕"}
      </span>
      <span>{message}</span>
    </div>
  );
}