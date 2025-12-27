import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats a phone number to the API format: +254XXXXXXXXX
 * Handles various input formats:
 * - 0742599123 -> +254742599123
 * - +254 742 599 123 -> +254742599123
 * - 254742599123 -> +254742599123
 * - 742599123 -> +254742599123
 */
export function formatPhoneNumberForAPI(phoneNumber: string): string {
  if (!phoneNumber) return phoneNumber;

  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, "");

  if (cleaned.length === 0) return phoneNumber;

  let formatted = "";

  if (cleaned.startsWith("254")) {
    // Already has country code 254
    // Take first 12 digits (254 + 9 digits)
    formatted = "+" + cleaned.slice(0, 12);
  } else if (cleaned.startsWith("0")) {
    // Starts with 0, replace with 254
    const withoutZero = cleaned.slice(1);
    // Take first 9 digits after removing the leading 0
    formatted = "+254" + withoutZero.slice(0, 9);
  } else {
    // No country code, add 254
    // Take first 9 digits
    formatted = "+254" + cleaned.slice(0, 9);
  }

  return formatted;
}

/**
 * Calculates age from date of birth
 * @param dateOfBirth - Date of birth string (ISO format or any valid date string)
 * @returns Age in years
 */
export function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0;

  try {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);

    if (isNaN(birthDate.getTime())) {
      console.warn("Invalid date of birth:", dateOfBirth);
      return 0;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  } catch (error) {
    console.error("Error calculating age:", error);
    return 0;
  }
}
