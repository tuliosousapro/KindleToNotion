import * as React from 'react';
import { cn } from './utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return <input ref={ref} className={cn('form-input w-full', className)} {...props} />;
});
Input.displayName = 'Input';

export { Input };
