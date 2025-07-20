import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gaming' | 'success' | 'warning' | 'danger';
  showPercentage?: boolean;
  showValue?: boolean;
  label?: string;
  className?: string;
  animated?: boolean;
  indeterminate?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'default',
  showPercentage = false,
  showValue = false,
  label,
  className,
  animated = true,
  indeterminate = false
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const variantClasses = {
    default: 'bg-gaming-400',
    gaming: 'bg-gradient-to-r from-gaming-500 to-gaming-300',
    success: 'bg-green-400',
    warning: 'bg-yellow-400',
    danger: 'bg-red-400'
  };

  return (
    <div className={clsx("w-full", className)}>
      {/* Label */}
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white">{label}</span>
          {showPercentage && (
            <span className="text-sm text-dark-400">{Math.round(percentage)}%</span>
          )}
          {showValue && !showPercentage && (
            <span className="text-sm text-dark-400">{value}/{max}</span>
          )}
        </div>
      )}

      {/* Progress Bar Container */}
      <div className={clsx(
        "w-full bg-dark-200 rounded-full overflow-hidden",
        sizeClasses[size]
      )}>
        {indeterminate ? (
          /* Indeterminate Animation */
          <motion.div
            className={clsx(
              "h-full rounded-full",
              variantClasses[variant]
            )}
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ width: "40%" }}
          />
        ) : (
          /* Determinate Progress */
          <motion.div
            className={clsx(
              "h-full rounded-full transition-colors",
              variantClasses[variant],
              animated && "transition-all duration-300 ease-out"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={animated ? { duration: 0.5, ease: "easeOut" } : { duration: 0 }}
          />
        )}
      </div>

      {/* Value Display (below bar) */}
      {(showPercentage || showValue) && !label && (
        <div className="flex justify-end mt-1">
          {showPercentage && (
            <span className="text-xs text-dark-400">{Math.round(percentage)}%</span>
          )}
          {showValue && !showPercentage && (
            <span className="text-xs text-dark-400">{value}/{max}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
