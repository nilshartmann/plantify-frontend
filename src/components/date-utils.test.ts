import { expect, it, vi } from "vitest";

import { getDaysUntilWatering } from "./date-utils.ts";
import { afterEach } from "node:test";

afterEach(() => {
  vi.useRealTimers();
})

it("should return number of days since reference date", () => {

  // attention: month are 0-based!
  const mockDate = new Date(2025, 11, 20); // 20.12.2025
  vi.setSystemTime(mockDate);

  // has to be watered in five days (20th is "now", 18+7=25)
  expect(getDaysUntilWatering("2025-12-18", 7)).toBe(5);
  // should have been watered at 17th, but has not...
  expect(getDaysUntilWatering("2025-12-10", 7)).toBe(-3);
})