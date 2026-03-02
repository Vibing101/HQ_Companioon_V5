import type { ItemDefinition } from "../types";
import { BASE_GEAR } from "./base/gear";
import { DREAD_MOON_MARKET_ITEMS } from "./dread_moon/gear";

export const GEAR_CATALOG: ItemDefinition[] = [...BASE_GEAR, ...DREAD_MOON_MARKET_ITEMS];
