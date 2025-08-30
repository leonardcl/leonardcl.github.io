import { useEffect, useState } from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
  isVisible: boolean;
  direction?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right';
  duration?: number;
  delay?: number;
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  isVisible,
  direction = 'fade',
  duration = 800,
  delay = 0
}) => {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  if (!shouldRender) return null;

  const getTransitionClasses = () => {
    const baseClasses = 'transition-all duration-700 ease-out';
    
    switch (direction) {
      case 'fade':
        return `${baseClasses} ${isVisible ? 'opacity-100' : 'opacity-0'}`;
      case 'slide-up':
        return `${baseClasses} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`;
      case 'slide-down':
        return `${baseClasses} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`;
      case 'slide-left':
        return `${baseClasses} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`;
      case 'slide-right':
        return `${baseClasses} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`;
      default:
        return `${baseClasses} ${isVisible ? 'opacity-100' : 'opacity-0'}`;
    }
  };

  return (
    <div
      className={getTransitionClasses()}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`
      }}
    >
      {children}
    </div>
  );
};

export default PageTransition;
