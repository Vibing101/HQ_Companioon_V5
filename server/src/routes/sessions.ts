import { Router } from "express";
import { SessionModel } from "../models/Session";
import { CampaignModel } from "../models/Campaign";
import { QUESTS, resolveEffectiveRules } from "@hq/shared";
import type { PackId } from "@hq/shared";

const router = Router();

// POST /api/campaigns/:campaignId/sessions — start a new session
router.post("/campaigns/:campaignId/sessions", async (req, res) => {
  try {
    const { questId } = req.body as { questId: string };
    if (!questId) return res.status(400).json({ error: "questId is required" });

    const campaign = await CampaignModel.findById(req.params.campaignId);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });

    const quest = QUESTS.find((q) => q.id === questId);
    if (!quest) return res.status(404).json({ error: "Quest not found" });

    const pack = campaign.enabledPacks.find((p) => p === quest.packId) as PackId | undefined;
    if (!pack) return res.status(400).json({ error: `Pack ${quest.packId} not enabled for this campaign` });

    const rulesSnapshot = resolveEffectiveRules(quest.packId, quest);

    const session = await SessionModel.create({
      campaignId: campaign._id.toString(),
      questId,
      startedAt: new Date(),
      rooms: [],
      monsters: [],
      rulesSnapshot,
    });

    return res.status(201).json({ session: docToJson(session) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to start session" });
  }
});

// GET /api/sessions/:id — load session
router.get("/sessions/:id", async (req, res) => {
  try {
    const session = await SessionModel.findById(req.params.id);
    if (!session) return res.status(404).json({ error: "Not found" });
    return res.json({ session: docToJson(session) });
  } catch (err) {
    return res.status(500).json({ error: "Failed to load session" });
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
