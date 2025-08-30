import { useEffect, useState, useRef } from 'react';

interface TransitionManagerProps {
  children: React.ReactNode;
  currentSection: string;
}

const TransitionManager: React.FC<TransitionManagerProps> = ({
  children,
  currentSection
}) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousSection, setPreviousSection] = useState<string>('');
  const [transitionDirection, setTransitionDirection] = useState<'up' | 'down'>('down');
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (previousSection && previousSection !== currentSection) {
      setIsTransitioning(true);
      
      // Determine transition direction based on section order
      const sections = ['home', 'about', 'career', 'education', 'publications', 'projects', 'contact'];
      const prevIndex = sections.indexOf(previousSection);
      const currentIndex = sections.indexOf(currentSection);
      
      setTransitionDirection(currentIndex > prevIndex ? 'down' : 'up');
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set transition duration
      timeoutRef.current = setTimeout(() => {
        setIsTransitioning(false);
      }, 800);
    }
    
    setPreviousSection(currentSection);
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentSection, previousSection]);

  return (
    <div className="relative">
      <div
        className={`transition-all duration-800 ease-out ${
          isTransitioning
            ? transitionDirection === 'down'
              ? 'opacity-0 translate-y-6 scale-95'
              : 'opacity-0 -translate-y-6 scale-95'
            : 'opacity-100 translate-y-0 scale-100'
        }`}
        style={{
          transformOrigin: 'center center',
          willChange: 'transform, opacity'
        }}
      >
        {children}
      </div>
      
      {/* Enhanced transition overlay with gradient */}
      {isTransitioning && (
        <div className="fixed inset-0 pointer-events-none transition-opacity duration-400 z-50">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-gray-950/10 to-transparent" />
        </div>
      )}
    </div>
  );
};

export default TransitionManager;
