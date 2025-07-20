import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    icon,
    fullWidth = false,
    className,
    disabled,
    children,
    ...props 
  }, ref) => {
    const baseClasses = [
      'inline-flex items-center justify-center gap-2',
      'font-medium rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-50',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      fullWidth && 'w-full'
    ];

    const variants = {
      primary: [
        'bg-gaming-500 hover:bg-gaming-600 active:bg-gaming-700',
        'text-white focus:ring-gaming-400',
        'shadow-lg hover:shadow-gaming-500/25'
      ],
      secondary: [
        'bg-dark-200 hover:bg-dark-300 active:bg-dark-400',
        'text-white focus:ring-dark-400'
      ],
      danger: [
        'bg-red-500 hover:bg-red-600 active:bg-red-700',
        'text-white focus:ring-red-400',
        'shadow-lg hover:shadow-red-500/25'
      ],
      ghost: [
        'bg-transparent hover:bg-dark-100/50 active:bg-dark-100',
        'text-dark-300 hover:text-white focus:ring-dark-400'
      ],
      outline: [
        'border-2 border-dark-300 hover:border-gaming-400',
        'bg-transparent hover:bg-gaming-500/10',
        'text-dark-300 hover:text-gaming-400 focus:ring-gaming-400'
      ]
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        className={clsx(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isDisabled}
        whileHover={!isDisabled ? { scale: 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
