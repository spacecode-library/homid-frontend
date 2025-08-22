import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showIcon?: boolean;
  className?: string;
  animate?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showIcon = true, 
  className = '',
  animate = true 
}) => {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };

  const containerSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14'
  };

  const LogoContent = () => (
    <div className={`flex items-center gap-2 ${className}`}>
      {showIcon && (
        <motion.img
          initial={animate ? { scale: 0, rotate: -180 } : {}}
          animate={animate ? { scale: 1, rotate: 0 } : {}}
          transition={{ duration: 0.5, type: "spring" }}
          src="/ID.svg"
          alt="Hom.ID Logo"
          className={containerSizes[size]}
        />
      )}
      <motion.h1 
        initial={animate ? { opacity: 0, x: -20 } : {}}
        animate={animate ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={`font-bold ${sizeClasses[size]} tracking-tight`}
      >
        <span className="text-blue-900">Hom</span>
        <span className="text-blue-400">.</span>
        <span className="text-blue-900">ID</span>
      </motion.h1>
    </div>
  );

  return <LogoContent />;
};

// Minimal version without icon
export const LogoText: React.FC<Omit<LogoProps, 'showIcon'>> = (props) => (
  <Logo {...props} showIcon={false} />
);