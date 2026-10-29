import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { Star, Zap, Sparkles, TrendingUp } from 'lucide-react';

export const UniqueAnimations: React.FC = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const rotate = useTransform(scrollY, [0, 500], [0, 360]);
  
  const springY1 = useSpring(y1, { stiffness: 100, damping: 30 });
  const springY2 = useSpring(y2, { stiffness: 100, damping: 30 });
  const springRotate = useSpring(rotate, { stiffness: 100, damping: 30 });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-32 overflow-hidden pointer-events-none">
      {/* Floating geometric shapes */}
      <motion.div
        style={{ y: springY1, rotate: springRotate }}
        className="absolute top-10 left-10 w-16 h-16 rounded-full bg-gradient-to-br from-[#1e4384]/20 to-[#be1e2d]/20 animate-morph-blob"
      />
      <motion.div
        style={{ y: springY2, rotate: useTransform(scrollY, [0, 500], [360, 0]) }}
        className="absolute top-20 right-20 w-20 h-20 rounded-full bg-gradient-to-br from-[#be1e2d]/20 to-[#f59e0b]/20 animate-morph-blob"
        style={{ animationDelay: '-4s' }}
      />
      <motion.div
        style={{ y: springY1 }}
        className="absolute bottom-10 left-1/3 w-12 h-12 rounded-full bg-gradient-to-br from-[#f59e0b]/20 to-[#1e4384]/20 animate-morph-blob"
        style={{ animationDelay: '-8s' }}
      />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-[#1e4384]/30"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.2,
          }}
        />
      ))}

      {/* Sparkles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className="absolute"
          style={{
            left: `${15 + i * 18}%`,
            top: `${30 + (i % 2) * 35}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4,
          }}
        >
          <Sparkles className="w-4 h-4 text-[#f59e0b]" />
        </motion.div>
      ))}

      {/* Mouse-following glow */}
      <motion.div
        className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-[#1e4384]/10 to-[#be1e2d]/10 blur-2xl"
        style={{
          x: mousePosition.x - 64,
          y: mousePosition.y - 64,
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
      />
    </div>
  );
};

export const MagneticButton: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => {
  const ref = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className="relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#1e4384] to-[#be1e2d] text-white font-bold rounded-full overflow-hidden ripple-effect"
    >
      <motion.span
        className="relative z-10"
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};

export const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`tilt-card ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      <motion.div
        className="tilt-card-inner"
        animate={{
          rotateX,
          rotateY,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export const NeonText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`neon-pulse ${className}`}
      style={{
        textShadow: '0 0 5px #1e4384, 0 0 10px #1e4384, 0 0 20px #1e4384, 0 0 40px #be1e2d',
      }}
      whileHover={{
        textShadow: '0 0 10px #1e4384, 0 0 20px #1e4384, 0 0 40px #1e4384, 0 0 80px #be1e2d, 0 0 120px #f59e0b',
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export const TextReveal: React.FC<{ children: string; className?: string }> = ({ children, className = '' }) => {
  const words = children.split(' ');
  
  return (
    <div className={className}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-1"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

export const ScrollingNumbers: React.FC<{ end: number; suffix?: string; label: string }> = ({ end, suffix = '', label }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const isInView = useScroll({
    target: countRef,
    offset: ['start end', 'end start'],
  });

  useEffect(() => {
    if (isInView.scrollYProgress > 0.5) {
      let current = 0;
      const increment = end / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, 30);
      return () => clearInterval(timer);
    }
  }, [isInView.scrollYProgress, end]);

  return (
    <div ref={countRef} className="text-center">
      <motion.div
        className="text-4xl font-bold text-[#1e4384]"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
      >
        {count}{suffix}
      </motion.div>
      <div className="text-sm text-slate-600 mt-2">{label}</div>
    </div>
  );
};

export const GlitchText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`glitch-effect relative ${className}`}
      whileHover={{
        x: [-2, 2, -2, 2, 0],
        y: [2, -2, 2, -2, 0],
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

export const WaveText: React.FC<{ children: string; className?: string }> = ({ children, className = '' }) => {
  const letters = children.split('');
  
  return (
    <div className={className}>
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          className="inline-block"
          animate={{
            y: [0, -5, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: index * 0.1,
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </div>
  );
};

export const AnimatedBorder: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return (
    <motion.div
      className={`relative p-1 rounded-2xl overflow-hidden ${className}`}
      whileHover={{
        boxShadow: '0 0 20px rgba(30, 67, 132, 0.4), 0 0 40px rgba(190, 30, 45, 0.2)',
      }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#1e4384] via-[#be1e2d] to-[#f59e0b] animate-gradient-shift"
        style={{ backgroundSize: '200% 200%' }}
      />
      <div className="relative bg-white rounded-xl">
        {children}
      </div>
    </motion.div>
  );
};
