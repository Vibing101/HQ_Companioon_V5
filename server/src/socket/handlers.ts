import type { Server, Socket } from "socket.io";
import { SessionModel } from "../models/Session";
import { HeroModel } from "../models/Hero";
import { PartyModel } from "../models/Party";
import type { SocketCommand } from "@hq/shared";

export function registerSocketHandlers(io: Server, socket: Socket) {
  const { sessionId, role } = socket.data as { sessionId?: string; role?: "gm" | "player" };

  socket.on("command", async (cmd: SocketCommand) => {
    try {
      switch (cmd.type) {
        case "ADJUST_POINTS":
          await handleAdjustPoints(io, socket, cmd);
          break;
        case "SELECT_HERO":
          await handleSelectHero(io, socket, cmd);
          break;
        case "SET_ROOM_STATE":
          await handleSetRoomState(io, socket, cmd);
          break;
        case "USE_ITEM":
          await handleUseItem(io, socket, cmd);
          break;
        case "SPAWN_MONSTER":
          await handleSpawnMonster(io, socket, cmd);
          break;
        case "REMOVE_MONSTER":
          await handleRemoveMonster(io, socket, cmd);
          break;
        default:
          socket.emit("error", { message: "Unknown command" });
      }
    } catch (err) {
      console.error("[socket] Command error:", err);
      socket.emit("error", { message: "Command failed" });
    }
  });
}

// ─── Handlers ─────────────────────────────────────────────────────────────────

async function handleAdjustPoints(io: Server, socket: Socket, cmd: Extract<SocketCommand, { type: "ADJUST_POINTS" }>) {
  const { entityType, entityId, pool, delta } = cmd;

  if (entityType === "hero") {
    const hero = await HeroModel.findById(entityId);
    if (!hero) return socket.emit("error", { message: "Hero not found" });

    if (pool === "BP") {
      hero.bodyPointsCurrent = Math.max(0, Math.min(hero.bodyPointsMax, hero.bodyPointsCurrent + delta));
      hero.statusFlags.isDead = hero.bodyPointsCurrent === 0;
    } else {
      hero.mindPointsCurrent = Math.max(0, Math.min(hero.mindPointsMax, hero.mindPointsCurrent + delta));
      hero.statusFlags.isInShock = hero.mindPointsCurrent === 0;
    }
    await hero.save();

    const roomId = `campaign:${hero.campaignId}`;
    io.to(roomId).emit("state_update", { type: "HERO_UPDATED", hero: heroToJson(hero) });
  } else {
    // Monster — find in session
    const sessionId = socket.data.sessionId as string;
    const session = await SessionModel.findById(sessionId);
    if (!session) return socket.emit("error", { message: "Session not found" });

    const monster = session.monsters.find((m) => m.id === entityId);
    if (!monster) return socket.emit("error", { message: "Monster not found" });

    if (pool === "BP") {
      monster.bodyPointsCurrent = Math.max(0, monster.bodyPointsCurrent + delta);
    } else if (pool === "MP" && monster.mindPointsCurrent !== undefined) {
      monster.mindPointsCurrent = Math.max(0, monster.mindPointsCurrent + delta);
    }

    await session.save();
    io.to(`session:${sessionId}`).emit("state_update", { type: "SESSION_UPDATED", session: sessionToJson(session) });
  }
}

async function handleSelectHero(io: Server, socket: Socket, cmd: Extract<SocketCommand, { type: "SELECT_HERO" }>) {
  const { sessionId, playerId, heroTypeId, heroName } = cmd;
  const session = await SessionModel.findById(sessionId);
  if (!session) return socket.emit("error", { message: "Session not found" });

  const { allowedHeroes, constraints } = session.rulesSnapshot as any;
  if (!allowedHeroes.includes(heroTypeId)) {
    return socket.emit("error", { message: `Hero type ${heroTypeId} is not allowed for this quest` });
  }

  io.to(`session:${sessionId}`).emit("state_update", { type: "HERO_SELECTED", playerId, heroTypeId, heroName });
}

async function handleSetRoomState(io: Server, socket: Socket, cmd: Extract<SocketCommand, { type: "SET_ROOM_STATE" }>) {
  if (socket.data.role !== "gm") {
    return socket.emit("error", { message: "Only GM can reveal rooms" });
  }

  const { sessionId, roomId, state } = cmd;
  const session = await SessionModel.findById(sessionId);
  if (!session) return socket.emit("error", { message: "Session not found" });

  const existing = session.rooms.find((r) => r.roomId === roomId);
  if (existing) {
    existing.state = state;
  } else {
    session.rooms.push({ roomId, state });
  }
  await session.save();

  io.to(`session:${sessionId}`).emit("state_update", { type: "SESSION_UPDATED", session: sessionToJson(session) });
}

async function handleUseItem(io: Server, socket: Socket, cmd: Extract<SocketCommand, { type: "USE_ITEM" }>) {
  const { heroId, itemId } = cmd;
  const hero = await HeroModel.findById(heroId);
  if (!hero) return socket.emit("error", { message: "Hero not found" });

  const itemIdx = hero.consumables.findIndex((i: any) => i.id === itemId);
  if (itemIdx === -1) return socket.emit("error", { message: "Item not found" });

  const item = hero.consumables[itemIdx];
  if ((item as any).quantity <= 1) {
    hero.consumables.splice(itemIdx, 1);
  } else {
    (item as any).quantity -= 1;
  }

  await hero.save();
  io.to(`campaign:${hero.campaignId}`).emit("state_update", { type: "HERO_UPDATED", hero: heroToJson(hero) });
}

async function handleSpawnMonster(io: Server, socket: Socket, cmd: Extract<SocketCommand, { type: "SPAWN_MONSTER" }>) {
  if (socket.data.role !== "gm") {
    return socket.emit("error", { message: "Only GM can spawn monsters" });
  }

  const { sessionId, monsterTypeId, label, roomId, bodyPointsMax, mindPointsCurrent } = cmd;
  const session = await SessionModel.findById(sessionId);
  if (!session) return socket.emit("error", { message: "Session not found" });

  const id = `${monsterTypeId}-${Date.now()}`;
  session.monsters.push({
    id,
    monsterTypeId,
    label,
    bodyPointsCurrent: bodyPointsMax,
    bodyPointsMax,
    mindPointsCurrent,
    roomId,
  } as any);
  await session.save();

  io.to(`session:${sessionId}`).emit("state_update", { type: "SESSION_UPDATED", session: sessionToJson(session) });
}

async function handleRemoveMonster(io: Server, socket: Socket, cmd: Extract<SocketCommand, { type: "REMOVE_MONSTER" }>) {
  if (socket.data.role !== "gm") {
    return socket.emit("error", { message: "Only GM can remove monsters" });
  }

  const { sessionId, monsterId } = cmd;
  const session = await SessionModel.findById(sessionId);
  if (!session) return socket.emit("error", { message: "Session not found" });

  session.monsters = session.monsters.filter((m: any) => m.id !== monsterId) as any;
  await session.save();

  io.to(`session:${sessionId}`).emit("state_update", { type: "SESSION_UPDATED", session: sessionToJson(session) });
}

// ─── Serializers ──────────────────────────────────────────────────────────────

function heroToJson(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id?.toString() ?? obj.id;
  delete obj._id;
  delete obj.__v;
  return obj;
}

function sessionToJson(doc: any) {
  const obj = doc.toObject ? doc.toObject() : doc;
  obj.id = obj._id?.toString() ?? obj.id;
  delete obj._id;
  delete obj.__v;
  return obj;
}
