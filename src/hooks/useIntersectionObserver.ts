import { useEffect, useState } from 'react';

export const useIntersectionObserver = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const sections = ['home', 'about', 'career', 'education', 'publications', 'projects', 'contact'];
    
    const observers = sections.map(sectionId => {
      const element = document.getElementById(sectionId);
      if (!element) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              // Add a small threshold to make transitions more natural
              if (entry.intersectionRatio > 0.3) {
                setActiveSection(sectionId);
              }
            }
          });
        },
        {
          threshold: [0.1, 0.3, 0.5, 0.7, 0.9],
          rootMargin: '-10% 0px -10% 0px'
        }
      );

      observer.observe(element);
      return observer;
    });

    return () => {
      observers.forEach(observer => {
        if (observer) observer.disconnect();
      });
    };
  }, []);

  return activeSection;
};
