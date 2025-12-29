import { FreebiePointsConfig } from "../../root/domain";

export const freebiePointsConfig: FreebiePointsConfig = {
  initialPoints: 15,
  list: [
    {
      name: "attribute",
      extractor: (charSheet) => {
        const attrs = charSheet.attributes;
        return Object.values(attrs).reduce((sum, val) => sum + Math.max(0, val - 1), 0) - 7 * 3;
      },
      multiplier: 5,
    },
    {
      name: "ability",
      extractor: (charSheet) => {
        const abilities = charSheet.abilities;
        return Object.values(abilities).reduce((sum, val) => sum + val, 0) - 27;
      },
      multiplier: 2,
    },
    {
      name: "background",
      extractor: (charSheet) => {
        return charSheet.backgrounds.reduce((sum, bg) => sum + bg.value, 0) - 5;
      },
      multiplier: 1,
    },
    {
      name: "edges",
      extractor: (charSheet) => {
        const edges = (charSheet as any).edges || [];
        return edges.reduce((sum: number, edge: any) => sum + (edge.level || 0), 0) - 3;
      },
      multiplier: 3,
    },
    {
      name: "virtues",
      extractor: (charSheet) => {
        const state = charSheet.state;
        const mercyBase = (state as any).mercyBase || 0;
        const visionBase = (state as any).visionBase || 0;
        const zealBase = (state as any).zealBase || 0;
        return mercyBase + visionBase + zealBase - 7;
      },
      multiplier: 2,
    },
    {
      name: "willpower",
      extractor: (charSheet) => {
        return charSheet.state.willpowerRating - 3;
      },
      multiplier: 1,
    },
  ],
};
