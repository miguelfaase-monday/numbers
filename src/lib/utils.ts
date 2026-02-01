import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function roundToNearest(value: number, precision: number): number {
  if (precision === 0) return Math.round(value);
  return Math.round(value / precision) * precision;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function formatGrade(grade: number, precision: number): string {
  if (precision >= 1) return grade.toFixed(0);
  if (precision === 0.5) return grade.toFixed(1);
  if (precision === 0.1) return grade.toFixed(1);
  return grade.toFixed(2);
}
