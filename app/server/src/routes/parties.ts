import { Router } from "express";
import { PartyModel } from "../models/Party";
import { docToJson } from "../utils/docToJson";

const router = Router();

// GET /api/parties/:id — load party (read-only)
router.get("/:id", async (req, res) => {
  try {
    const party = await PartyModel.findById(req.params.id);
    if (!party) return res.status(404).json({ error: "Not found" });
    if (!Array.isArray((party as any).unlockedMercenaryTypes)) (party as any).unlockedMercenaryTypes = [];
    if (!Array.isArray((party as any).mercenaries)) (party as any).mercenaries = [];
    return res.json({ party: docToJson(party) });
  } catch {
    return res.status(500).json({ error: "Failed to load party" });
  }
});

export default router;
