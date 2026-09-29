import { useState, useEffect } from 'react';

export function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [scrolledPast, setScrolledPast] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollDirection = () => {
      const currentScrollY = window.pageYOffset;
      setScrollY(currentScrollY);
      setScrolledPast(currentScrollY > 40);

      const direction = currentScrollY > lastScrollY ? 'down' : 'up';
      if (
        direction !== scrollDirection &&
        (currentScrollY - lastScrollY > 5 || currentScrollY - lastScrollY < -5)
      ) {
        setScrollDirection(direction);
      }
      lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
    };

    window.addEventListener('scroll', updateScrollDirection, { passive: true });
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, [scrollDirection]);

  return { scrollDirection, scrolledPast, scrollY };
}
