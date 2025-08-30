import { useEffect, useState, useRef } from 'react';

interface SectionTransitionProps {
  children: React.ReactNode;
  sectionId: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  delay?: number;
  duration?: number;
}

const SectionTransition: React.FC<SectionTransitionProps> = ({
  children,
  direction = 'fade',
  delay = 0,
  duration = 400
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setIsVisible(true);
            setHasAnimated(true);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '-20px 0px -20px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  const getTransitionClasses = () => {
    const baseClasses = 'transition-all duration-400 ease-out';
    
    if (!isVisible) {
      switch (direction) {
        case 'up':
          return `${baseClasses} opacity-0 translate-y-4 scale-98`;
        case 'down':
          return `${baseClasses} opacity-0 -translate-y-4 scale-98`;
        case 'left':
          return `${baseClasses} opacity-0 translate-x-4 scale-98`;
        case 'right':
          return `${baseClasses} opacity-0 -translate-x-4 scale-98`;
        case 'fade':
        default:
          return `${baseClasses} opacity-0 scale-98`;
      }
    }
    
    return `${baseClasses} opacity-100 translate-y-0 translate-x-0 scale-100`;
  };

  return (
    <div
      ref={sectionRef}
      className={getTransitionClasses()}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
        transformOrigin: 'center center',
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  );
};

export default SectionTransition;
