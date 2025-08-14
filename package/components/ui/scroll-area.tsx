import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { cn } from './utils';

export const ScrollArea: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <ScrollAreaPrimitive.Root className={cn('h-48 w-full overflow-hidden', className)} {...props}>
      <ScrollAreaPrimitive.Viewport className="w-full h-full">{children}</ScrollAreaPrimitive.Viewport>
    </ScrollAreaPrimitive.Root>
  );
};
