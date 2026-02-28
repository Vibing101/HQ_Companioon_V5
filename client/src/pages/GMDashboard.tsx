import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { QUESTS, MONSTER_TYPES, resolveEffectiveRules } from "@hq/shared";
import type { Campaign, Hero, Session } from "@hq/shared";
import { joinSession, onStateUpdate, sendCommand } from "../socket";
import QuestSelector from "../components/QuestSelector";
import PartyOverview from "../components/PartyOverview";
import MonsterTracker from "../components/MonsterTracker";
import RoomGrid from "../components/RoomGrid";

type Tab = "quest" | "party" | "monsters" | "rooms";

export default function GMDashboard() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("quest");
  const [selectedQuestId, setSelectedQuestId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joinCode, setJoinCode] = useState("");

  // Monster spawn form
  const [spawnType, setSpawnType] = useState(MONSTER_TYPES[0].id);
  const [spawnLabel, setSpawnLabel] = useState("");
  const [spawnRoom, setSpawnRoom] = useState("room-1");

  const loadCampaign = useCallback(async () => {
    if (!campaignId) return;
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCampaign(data.campaign);
      setJoinCode(data.campaign.joinCode);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [campaignId]);

  const loadHeroes = useCallback(async () => {
    if (!campaignId) return;
    const res = await fetch(`/api/heroes/campaign/${campaignId}`);
    const data = await res.json();
    if (res.ok) setHeroes(data.heroes);
  }, [campaignId]);

  useEffect(() => {
    loadCampaign();
    loadHeroes();
  }, [loadCampaign, loadHeroes]);

  useEffect(() => {
    if (!campaignId) return;
    joinSession({ campaignId, role: "gm" });
    const unsub = onStateUpdate((update) => {
      if (update.type === "SESSION_UPDATED") setSession(update.session);
      if (update.type === "HERO_UPDATED") {
        setHeroes((prev) => prev.map((h) => (h.id === update.hero.id ? update.hero : h)));
      }
    });
    return unsub;
  }, [campaignId]);

  async function startSession() {
    if (!selectedQuestId || !campaignId) return;
    const res = await fetch(`/api/campaigns/${campaignId}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questId: selectedQuestId }),
    });
    const data = await res.json();
    if (res.ok) {
      setSession(data.session);
      setActiveTab("monsters");
    } else {
      setError(data.error);
    }
  }

  function spawnMonster() {
    if (!session || !spawnLabel.trim()) return;
    const mt = MONSTER_TYPES.find((m) => m.id === spawnType);
    if (!mt) return;
    sendCommand({
      type: "SPAWN_MONSTER",
      sessionId: session.id,
      monsterTypeId: spawnType,
      label: spawnLabel.trim(),
      roomId: spawnRoom,
      bodyPointsMax: mt.bodyPointsMax,
      mindPointsCurrent: mt.mindPointsCurrent,
    });
    setSpawnLabel("");
  }

  async function markQuestCompleted(questId: string) {
    await fetch(`/api/campaigns/${campaignId}/quest-log/${questId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" }),
    });
    loadCampaign();
  }

  if (loading) return <div className="flex items-center justify-center h-screen text-parchment">Loading…</div>;
  if (error) return <div className="flex items-center justify-center h-screen text-hq-red">{error}</div>;
  if (!campaign) return null;

  const TABS: { id: Tab; label: string }[] = [
    { id: "quest", label: "Quest" },
    { id: "party", label: "Party" },
    { id: "monsters", label: "Monsters" },
    { id: "rooms", label: "Rooms" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-hq-brown border-b border-hq-amber/30 px-4 py-3 flex items-center gap-3">
        <h1 className="text-xl font-display text-hq-amber flex-1">{campaign.name}</h1>
        <span className="badge-gm">GM</span>
        <div className="text-right">
          <p className="text-xs text-parchment/50">Join Code</p>
          <p className="font-mono font-bold text-hq-amber tracking-widest">{joinCode}</p>
        </div>
      </header>

      {/* Tab nav */}
      <nav className="bg-hq-brown/50 border-b border-hq-amber/20 flex">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 py-2 text-sm font-semibold transition-colors ${
              activeTab === t.id
                ? "text-hq-amber border-b-2 border-hq-amber"
                : "text-parchment/50 hover:text-parchment"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main className="flex-1 p-4 overflow-y-auto">
        {activeTab === "quest" && (
          <div className="space-y-4">
            <QuestSelector
              campaign={campaign}
              selectedQuestId={selectedQuestId}
              onSelectQuest={setSelectedQuestId}
            />
            {selectedQuestId && (
              <div className="card space-y-3">
                <div>
                  <p className="text-sm text-parchment/70 mb-1">Selected Quest</p>
                  <p className="font-bold text-hq-amber">
                    {QUESTS.find((q) => q.id === selectedQuestId)?.title}
                  </p>
                  {(() => {
                    const quest = QUESTS.find((q) => q.id === selectedQuestId);
                    if (!quest) return null;
                    const rules = resolveEffectiveRules(quest.packId, quest);
                    return (
                      <p className="text-xs text-parchment/50 mt-1">
                        Allowed heroes: {rules.allowedHeroes.join(", ")}
                      </p>
                    );
                  })()}
                </div>
                <button className="btn-primary w-full" onClick={startSession} disabled={!!session}>
                  {session ? "Session Running" : "Start Session"}
                </button>
                {session && (
                  <button
                    className="btn-secondary w-full text-sm"
                    onClick={() => markQuestCompleted(selectedQuestId)}
                  >
                    Mark Quest Completed
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "party" && (
          <div className="space-y-4">
            <h2 className="text-lg font-display text-hq-amber">Party</h2>
            <PartyOverview heroes={heroes} isGM={true} />
          </div>
        )}

        {activeTab === "monsters" && session && (
          <div className="space-y-4">
            {/* Spawn form */}
            <div className="card space-y-3">
              <h2 className="text-sm font-bold text-hq-amber uppercase tracking-wider">Spawn Monster</h2>
              <select
                className="input"
                value={spawnType}
                onChange={(e) => setSpawnType(e.target.value)}
              >
                {MONSTER_TYPES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.bodyPointsMax} BP)
                  </option>
                ))}
              </select>
              <input
                className="input"
                placeholder="Label (e.g. Goblin A)"
                value={spawnLabel}
                onChange={(e) => setSpawnLabel(e.target.value)}
              />
              <input
                className="input"
                placeholder="Room ID (e.g. room-3)"
                value={spawnRoom}
                onChange={(e) => setSpawnRoom(e.target.value)}
              />
              <button className="btn-primary w-full" onClick={spawnMonster} disabled={!spawnLabel.trim()}>
                Spawn
              </button>
            </div>

            <MonsterTracker monsters={session.monsters} sessionId={session.id} isGM={true} />
          </div>
        )}

        {activeTab === "monsters" && !session && (
          <p className="text-center text-parchment/50 py-8">Start a session first to track monsters.</p>
        )}

        {activeTab === "rooms" && session && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-hq-amber uppercase tracking-wider">Rooms — tap to cycle state</h2>
            <RoomGrid rooms={session.rooms} sessionId={session.id} isGM={true} />
          </div>
        )}

        {activeTab === "rooms" && !session && (
          <p className="text-center text-parchment/50 py-8">Start a session first to track rooms.</p>
        )}
      </main>
    </div>
  );
}
