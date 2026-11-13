import { SLOTS, MIN_VALUE, MAX_VALUE } from "../constants.js";
import { getToday, isValidDate } from "./date.helper.js";

// returns the first error message, or null if everything is fine
export function validateReading({ value, reading_date, slot }) {
  if (value === undefined || value === null || value === "") {
    return "Please enter a glucose value.";
  }

  const num = Number(value);
  if (!Number.isInteger(num) || num < MIN_VALUE || num > MAX_VALUE) {
    return `Value must be between ${MIN_VALUE} and ${MAX_VALUE} mg/dl.`;
  }

  if (!isValidDate(reading_date)) {
    return "Please select a valid date.";
  }
  if (reading_date > getToday()) {
    return "Date cannot be in the future.";
  }

  if (!SLOTS.includes(slot)) {
    return "Please choose a time slot.";
  }

  return null;
}
