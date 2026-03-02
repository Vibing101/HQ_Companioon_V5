import type { PackDefinition } from "../types";

export const BASE_PACK: PackDefinition = {
  id: "BASE",
  allowedHeroes: ["barbarian", "dwarf", "elf", "wizard"],
  enabledSystems: {
    reputationTokens: false,
    disguises: false,
    mercenaries: false,
    alchemy: false,
    mindShock: false,
    etherealMonsters: false,
    undergroundMarket: false,
    hideouts: false,
  },
  constraints: { uniqueHeroesOnly: true, maxPartySize: 4 },
};
