import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn: A utility function to merge Tailwind CSS class names.
 * It handles conditional classes and removes duplicates.
 */
export function cn(...inputs: (string | undefined | null | boolean)[]) {
  return twMerge(clsx(inputs));
}