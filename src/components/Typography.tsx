import React from 'react';
import { motion } from 'framer-motion';

interface TypographyProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'body-sm' | 'caption';
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
  color?: 'default' | 'primary' | 'secondary' | 'muted' | 'error' | 'success';
}

const variantClasses = {
  h1: 'text-4xl sm:text-5xl font-light tracking-tight',
  h2: 'text-3xl sm:text-4xl font-light',
  h3: 'text-2xl sm:text-3xl font-medium',
  h4: 'text-xl sm:text-2xl font-medium',
  body: 'text-base font-normal',
  'body-sm': 'text-sm font-normal',
  caption: 'text-xs font-normal'
};

const colorClasses = {
  default: 'text-gray-800',
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  muted: 'text-gray-500',
  error: 'text-red-600',
  success: 'text-green-600'
};

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  children,
  className = '',
  animate = false,
  color = 'default'
}) => {
  const classes = `
    ${variantClasses[variant]}
    ${colorClasses[color]}
    ${className}
  `.trim();
  
  const content = React.createElement(
    variant.startsWith('h') ? variant : 'p',
    { className: classes },
    children
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

// Convenience components
export const H1: React.FC<Omit<TypographyProps, 'variant'>> = (props) => 
  <Typography variant="h1" {...props} />;

export const H2: React.FC<Omit<TypographyProps, 'variant'>> = (props) => 
  <Typography variant="h2" {...props} />;

export const H3: React.FC<Omit<TypographyProps, 'variant'>> = (props) => 
  <Typography variant="h3" {...props} />;

export const H4: React.FC<Omit<TypographyProps, 'variant'>> = (props) => 
  <Typography variant="h4" {...props} />;

export const Body: React.FC<Omit<TypographyProps, 'variant'>> = (props) => 
  <Typography variant="body" {...props} />;

export const Caption: React.FC<Omit<TypographyProps, 'variant'>> = (props) => 
  <Typography variant="caption" {...props} />;