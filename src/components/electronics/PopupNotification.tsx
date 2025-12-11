import { useEffect, useState } from 'react';
import { Lightbulb, Zap, BookOpen, CheckCircle } from 'lucide-react';

type PopupType = 'hint' | 'action' | 'learn' | 'success';

interface PopupNotificationProps {
  message: string;
  type?: PopupType;
  duration?: number;
  onDismiss?: () => void;
  isVisible: boolean;
}

export const PopupNotification = ({
  message,
  type = 'hint',
  duration = 3500,
  onDismiss,
  isVisible,
}: PopupNotificationProps) => {
  const [progress, setProgress] = useState(100);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      setProgress(100);

      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);

        if (remaining <= 0) {
          clearInterval(interval);
          setShow(false);
          setTimeout(() => onDismiss?.(), 300);
        }
      }, 50);

      return () => clearInterval(interval);
    } else {
      setShow(false);
    }
  }, [isVisible, duration, onDismiss]);

  const getTypeStyles = () => {
    switch (type) {
      case 'hint':
        return {
          icon: Lightbulb,
          bg: 'bg-gradient-to-r from-star/20 to-star/10',
          border: 'border-star/50',
          iconColor: 'text-star',
          progressColor: 'bg-star',
        };
      case 'action':
        return {
          icon: Zap,
          bg: 'bg-gradient-to-r from-primary/20 to-primary/10',
          border: 'border-primary/50',
          iconColor: 'text-primary',
          progressColor: 'bg-primary',
        };
      case 'learn':
        return {
          icon: BookOpen,
          bg: 'bg-gradient-to-r from-secondary/20 to-secondary/10',
          border: 'border-secondary/50',
          iconColor: 'text-secondary',
          progressColor: 'bg-secondary',
        };
      case 'success':
        return {
          icon: CheckCircle,
          bg: 'bg-gradient-to-r from-capacitor/20 to-capacitor/10',
          border: 'border-capacitor/50',
          iconColor: 'text-capacitor',
          progressColor: 'bg-capacitor',
        };
    }
  };

  const styles = getTypeStyles();
  const Icon = styles.icon;

  if (!isVisible && !show) return null;

  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        show ? 'animate-slide-down' : 'animate-slide-up opacity-0'
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border ${styles.border} ${styles.bg} backdrop-blur-md px-6 py-4 shadow-2xl min-w-[320px] max-w-lg`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full ${styles.bg} ${styles.iconColor}`}>
            <Icon className="w-6 h-6" />
          </div>
          <p className="text-foreground text-lg font-medium leading-relaxed flex-1">
            {message}
          </p>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted/30">
          <div
            className={`h-full ${styles.progressColor} transition-all duration-100 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
