import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: Array<any>) {
  return twMerge(clsx(...inputs));
}
