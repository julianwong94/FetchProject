import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const pluralize = (count: number, noun: string, suffix = "s") =>
  `${noun}${count !== 1 ? suffix : ""}`;
