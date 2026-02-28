import { Router } from "express";
import { HeroModel } from "../models/Hero";
import { PartyModel } from "../models/Party";
import { HERO_BASE_STATS } from "@hq/shared";
import type { HeroTypeId } from "@hq/shared";

const router = Router();

// POST /api/heroes — create a hero
router.post("/", async (req, res) => {
  try {
    const { heroTypeId, name, playerId, campaignId, partyId } = req.body as {
      heroTypeId: HeroTypeId;
      name: string;
      playerId: string;
      campaignId: string;
      partyId: string;
    };

    if (!heroTypeId || !name || !playerId || !campaignId) {
      return res.status(400).json({ error: "heroTypeId, name, playerId, campaignId are required" });
    }

    const stats = HERO_BASE_STATS[heroTypeId];
    if (!stats) return res.status(400).json({ error: "Invalid heroTypeId" });

    const hero = await HeroModel.create({
      heroTypeId,
      name,
      playerId,
      campaignId,
      ...stats,
      bodyPointsCurrent: stats.bodyPointsMax,
      mindPointsCurrent: stats.mindPointsMax,
      gold: 0,
      equipment: [],
      consumables: [],
      spellsChosenThisQuest: [],
      statusFlags: { isDead: false, isInShock: false, isDisguised: false },
    });

    if (partyId) {
      await PartyModel.findByIdAndUpdate(partyId, {
        $addToSet: { heroIds: hero._id.toString() },
      });
    }

    return res.status(201).json({ hero: docToJson(hero) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to create hero" });
  }
});

// GET /api/heroes/:id — load hero
router.get("/:id", async (req, res) => {
  try {
    const hero = await HeroModel.findById(req.params.id);
    if (!hero) return res.status(404).json({ error: "Not found" });
    return res.json({ hero: docToJson(hero) });
  } catch (err) {
    return res.status(500).json({ error: "Failed to load hero" });
  }
});

// GET /api/campaigns/:campaignId/heroes — list heroes for a campaign
router.get("/campaign/:campaignId", async (req, res) => {
  try {
    const heroes = await HeroModel.find({ campaignId: req.params.campaignId });
    return res.json({ heroes: heroes.map(docToJson) });
  } catch (err) {
    return res.status(500).json({ error: "Failed to list heroes" });
  }
});

function docToJson(doc: any) {
  const obj = doc.toObject({ virtuals: false });
  obj.id = obj._id.toString();
  delete obj._id;
  delete obj.__v;
  return obj;
}

export default router;
