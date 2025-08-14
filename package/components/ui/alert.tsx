import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from './utils';

const alertVariants = cva('p-3 rounded-md border', {
  variants: {
    variant: {
      default: 'bg-background text-foreground',
      destructive: 'bg-destructive text-white',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive';
  children?: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ className, variant = 'default', children, ...props }) => {
  return (
    <div role="alert" className={cn(alertVariants({ variant, className }))} {...props}>
      {children}
    </div>
  );
};

export const AlertDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => {
  return (
    <div className={cn('text-sm', className)} {...props}>
      {children}
    </div>
  );
};
