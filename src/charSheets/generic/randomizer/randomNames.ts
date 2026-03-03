import { randomInteger } from "../../../lib/miscUtils";
import { pickRandom } from "./randomUtils";

/** First names — a mix of classic WoD-appropriate names. */
const FIRST_NAMES = [
  // Male
  "Alexander", "Marcus", "Victor", "Sebastian", "Lucian",
  "Raphael", "Damien", "Nikolai", "Julian", "Maximilian",
  "Aldric", "Henrik", "Cassius", "Leander", "Gregor",
  "Anton", "Desmond", "Elias", "Felix", "Hugo",
  "Ivan", "Jasper", "Klaus", "Leopold", "Marcel",
  "Nathaniel", "Orion", "Pascal", "Quentin", "Roland",
  "Stefan", "Tristan", "Ulric", "Vincent", "Wolfgang",
  "Adrian", "Benedict", "Conrad", "Dorian", "Edmund",
  "Fabian", "Gabriel", "Hadrian", "Ignatius", "Jerome",
  // Female
  "Victoria", "Isabella", "Anastasia", "Seraphina", "Lucretia",
  "Morgana", "Cassandra", "Helena", "Lilith", "Celestine",
  "Mirabel", "Evangeline", "Cordelia", "Ophelia", "Vivienne",
  "Aurora", "Beatrice", "Camille", "Delphine", "Eloise",
  "Fiona", "Genevieve", "Harriet", "Ingrid", "Josephine",
  "Katarina", "Lenore", "Marguerite", "Nadia", "Odette",
  "Petra", "Rosalind", "Sylvia", "Tatiana", "Ursula",
  "Valentina", "Winifred", "Ximena", "Yvette", "Zelda",
  "Amara", "Bianca", "Clara", "Diana", "Elena",
];

const SURNAMES = [
  "Blackwood", "Ashford", "Darkholme", "Ravencroft", "Thornton",
  "Langley", "Whitmore", "Sterling", "Cross", "Harker",
  "Graves", "Sinclair", "Vane", "Montague", "Ashworth",
  "Beaumont", "Castellan", "De Vries", "Erikson", "Fairfax",
  "Grimaldi", "Hartwell", "Ivanova", "Jansen", "Kessler",
  "Laurent", "Moreau", "Norwood", "O'Brien", "Prescott",
  "Roux", "Strauss", "Thorne", "Underhill", "Volkov",
  "Wentworth", "Ashcroft", "Ballard", "Crane", "Dragomir",
  "Everett", "Forsythe", "Grant", "Holloway", "Irving",
  "Kingsley", "Lockhart", "Mercer", "Nightingale", "Osborn",
  "Pemberton", "Quinn", "Rosenthal", "Salvatore", "Talbot",
];

/**
 * Generate a random full name (first + surname).
 */
export function randomName(): string {
  return `${pickRandom(FIRST_NAMES)} ${pickRandom(SURNAMES)}`;
}

/**
 * Generate a random apparent age for a character.
 * @param preset - preset name to adjust range (vampires: 18–55, mortals: 18–45, etc.)
 */
export function randomAge(preset: string): string {
  // Vampires were embraced at various ages — skew slightly older
  if (preset.includes("vampire") || preset.includes("demon")) {
    return String(randomInteger(18, 55));
  }
  // Mages and hunters are typically somewhat younger
  return String(randomInteger(18, 45));
}
