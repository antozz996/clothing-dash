import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility per combinare classi Tailwind senza conflitti.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
