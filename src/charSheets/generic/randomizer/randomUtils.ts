import { randomInteger } from "../../../lib/miscUtils";
import { OptionGroup } from "../../root/domain";

/**
 * Pick a random element from an array.
 */
export function pickRandom<T>(arr: readonly T[]): T {
  return arr[randomInteger(0, arr.length - 1)];
}

/**
 * Shuffle an array (Fisher-Yates).
 */
export function shuffle<T>(arr: readonly T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomInteger(0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Distribute `totalDots` randomly among `count` slots,
 * where each slot is between `min` and `max`.
 */
export function distributeDots(
  count: number,
  totalDots: number,
  min: number,
  max: number,
): number[] {
  const result = new Array(count).fill(min);
  let remaining = totalDots - min * count;

  if (remaining < 0) {
    throw new Error(
      `Cannot distribute ${totalDots} dots among ${count} slots with min ${min}`,
    );
  }

  // Randomly distribute remaining dots
  let attempts = 0;
  while (remaining > 0 && attempts < 10000) {
    const idx = randomInteger(0, count - 1);
    if (result[idx] < max) {
      result[idx]++;
      remaining--;
    }
    attempts++;
  }

  return result;
}

/**
 * Get all items from Options (which can be string[] or OptionGroup[]).
 */
export function flattenOptions(
  options: string[] | OptionGroup[] | undefined,
): string[] {
  if (!options || options.length === 0) return [];
  if (typeof options[0] === "string") {
    return options as string[];
  }
  return (options as OptionGroup[]).flatMap((g) => g.arr);
}

/**
 * Pick a random item from Options (string[] or OptionGroup[]).
 */
export function pickRandomOption(
  options: string[] | OptionGroup[] | undefined,
): string {
  const flat = flattenOptions(options);
  if (flat.length === 0) return "";
  return pickRandom(flat);
}

/**
 * Extract numeric cost from a merit/flaw name string.
 * E.g. "Acute Sense (1pt)" → 1
 */
export function extractCost(name: string): number {
  const str = name.replace(/\D/g, "");
  return str === "" ? 0 : Number(str);
}

/**
 * Distribute priority dots (e.g. [7,5,3]) among groups randomly.
 * Returns an array of the same length as priorities, shuffled.
 */
export function randomizePriorities(
  priorities: readonly number[],
): number[] {
  return shuffle(priorities) as number[];
}
