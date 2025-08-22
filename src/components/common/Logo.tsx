import type { FC } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showDot?: boolean;
}

export const Logo: FC<LogoProps> = ({ 
  size = 'md', 
  className = '', 
  showDot = true 
}) => {
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`${className}`}>
      <span className={`font-bold ${sizeClasses[size]}`}>
        <span className="text-blue-900">Hom</span>
        <span className="text-blue-400">.</span>
        <span className="text-blue-900">ID</span>
      </span>
    </div>
  );
};