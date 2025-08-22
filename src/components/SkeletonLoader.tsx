import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  type?: 'text' | 'title' | 'card' | 'button' | 'image' | 'custom';
  width?: string;
  height?: string;
  className?: string;
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'text',
  width,
  height,
  className = '',
  count = 1
}) => {
  const getDefaultStyles = () => {
    switch (type) {
      case 'title':
        return 'h-8 w-48';
      case 'text':
        return 'h-4 w-full';
      case 'card':
        return 'h-32 w-full';
      case 'button':
        return 'h-10 w-24';
      case 'image':
        return 'h-48 w-full';
      case 'custom':
        return '';
      default:
        return 'h-4 w-full';
    }
  };

  const baseStyles = `bg-gray-200 rounded-lg animate-pulse ${getDefaultStyles()} ${className}`;
  const customStyles = {
    width: width || undefined,
    height: height || undefined
  };

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className={`${baseStyles} ${index > 0 ? 'mt-2' : ''}`}
          style={customStyles}
        />
      ))}
    </>
  );
};

// Composite skeleton components for common patterns
export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <SkeletonLoader type="title" className="mb-4" />
    <SkeletonLoader type="text" count={3} />
    <div className="flex gap-2 mt-4">
      <SkeletonLoader type="button" />
      <SkeletonLoader type="button" />
    </div>
  </div>
);

export const TableRowSkeleton: React.FC = () => (
  <div className="flex items-center gap-4 p-4 border-b border-gray-100">
    <SkeletonLoader type="custom" width="40px" height="40px" className="rounded-full" />
    <div className="flex-1">
      <SkeletonLoader type="text" width="60%" />
      <SkeletonLoader type="text" width="40%" className="mt-1" />
    </div>
    <SkeletonLoader type="button" />
  </div>
);

export const StatCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-start justify-between mb-4">
      <SkeletonLoader type="custom" width="48px" height="48px" className="rounded-xl" />
      <SkeletonLoader type="custom" width="60px" height="24px" />
    </div>
    <SkeletonLoader type="custom" width="80px" height="32px" className="mb-1" />
    <SkeletonLoader type="text" width="120px" />
  </div>
);