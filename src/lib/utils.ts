import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import axios from "axios";
import {
  differenceInDays,
  differenceInMonths,
  differenceInMinutes,
} from "date-fns";
export * from "./variables";
export * from "./network-manager";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export const truncateText = (text: string, maxLength: number) => {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  } else {
    return text;
  }
};

export const parseCategory = (text: string) => {
  const category: string | string[] = text.split("_").join(" ");

  return category;
};

export const imageLinkParser = (url_json: string) => {
  const images: string[] = isJsonString(url_json)
    ? JSON.parse(url_json)
    : url_json;
  // console.log(images);
  return images;
};

interface ImageDimensions {
  width: number;
  height: number;
  isWider: boolean;
  isTaller: boolean;
}

export const detectImageDimensions = (
  imageUrl: string
): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      const width: number = img.width;
      const height: number = img.height;

      const isWider: boolean = width > height + 100;
      const isTaller: boolean = height > width + 100;

      resolve({ isWider, isTaller, width, height });
    };

    img.onerror = () => {
      reject(new Error("Failed to load image."));
    };
  });
};

export const formatMoneyWithCommas = (number: number) => {
  // Convert the number to a string
  let numStr = number.toString();

  // Split the number into integer and decimal parts (if any)
  const parts = numStr.split(".");
  let integerPart = parts[0];
  const decimalPart = parts[1] ? `.${parts[1]}` : "";

  // Add commas every three digits in the integer part
  if (integerPart.length > 3) {
    const integerArr = integerPart.split("");
    for (let i = integerArr.length - 3; i > 0; i -= 3) {
      integerArr.splice(i, 0, ",");
    }
    integerPart = integerArr.join("");
  }

  // Return the formatted money string
  return integerPart + decimalPart;
};

export const $axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_ADDRESS,
});

/**
 * Calculates the time elapsed from the given date to now.
 *
 * @param {Date|string|number} date The date from which to calculate the elapsed time.
 * @return {string} A string describing the amount of time elapsed.
 */
export function elapsedTimeFrom(date: Date | string | number) {
  const now = new Date();
  const startDate = new Date(date);
  const diffDays = differenceInDays(now, startDate);
  const diffMonths = differenceInMonths(now, startDate);
  const diffMinutes = differenceInMinutes(now, startDate);
  if (diffMonths >= 3) {
    // More than 90 days, show months
    return `${diffMonths} ${diffMonths !== 1 ? "s" : ""} meses`;
  } else if (diffDays >= 1) {
    // More than 1 day but less than 90 days, show days
    return `${diffDays} dia${diffDays !== 1 ? "s" : ""}`;
  } else {
    // Less than 1 day, show in hours or minutes
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours >= 1) {
      // More than or equal to 60 minutes, show in hours
      return `${diffHours} hora${diffHours !== 1 ? "s" : ""}`;
    } else {
      // Less than 60 minutes, show in minutes
      return `${diffMinutes} minuto${diffMinutes !== 1 ? "s" : ""}`;
    }
  }
}
