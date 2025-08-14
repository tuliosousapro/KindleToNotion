import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from './utils';

export interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  children?: React.ReactNode;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
  return <LabelPrimitive.Root ref={ref} className={cn('text-sm font-medium', className)} {...props} />;
});
Label.displayName = 'Label';

export { Label };
