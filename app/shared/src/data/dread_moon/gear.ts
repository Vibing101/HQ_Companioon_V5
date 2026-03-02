import type { ItemDefinition } from "../../types";

export const DREAD_MOON_MARKET_ITEMS: ItemDefinition[] = [
  {
    id: "caltrops",
    name: "Caltrops",
    category: "consumable",
    costGold: 100,
    description: "Place during movement to hinder non-ethereal monsters",
  },
  {
    id: "smoke_bomb",
    name: "Smoke Bomb",
    category: "consumable",
    costGold: 100,
    description: "Use during movement on adjacent monster to pass through unseen",
  },
  {
    id: "reagent_kit",
    name: "Reagent Kit",
    category: "tool",
    costGold: 400,
    description: "Alchemy tool with 5 uses",
  },
];
