import mongoose, { Schema, Document } from "mongoose";
import type { Party } from "@hq/shared";

export interface PartyDoc extends Omit<Party, "id">, Document {}

const PartySchema = new Schema<PartyDoc>({
  campaignId: { type: String, required: true },
  heroIds: [String],
  reputationTokens: { type: Number, default: 0 },
  unlockedMercenaryTypes: { type: [String], default: [] },
  mercenaries: {
    type: [{
      id: String,
      mercenaryTypeId: String,
      name: String,
      bodyPointsCurrent: Number,
      bodyPointsMax: Number,
      hiredByHeroId: String,
    }],
    default: [],
  },
});

export const PartyModel = mongoose.model<PartyDoc>("Party", PartySchema);
