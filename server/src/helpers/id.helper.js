import { randomUUID } from "node:crypto";

export function generateId() {
  return randomUUID();
}

// true only for a valid UUID string (stops bad ids from reaching the database)
export function isValidId(id) {
  return (
    typeof id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  );
}
