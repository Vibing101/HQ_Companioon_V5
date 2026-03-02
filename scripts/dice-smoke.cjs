const assert = require("node:assert/strict");
const dice = require("../app/shared/dist/engine/dice.js");
const shared = require("../app/shared/dist/types.js");

function testDiceFaces() {
  const seen = new Set();
  for (let i = 0; i < 200; i += 1) {
    for (const face of dice.rollCombatDice(12)) {
      assert.ok(face === "skull" || face === "whiteShield" || face === "blackShield");
      seen.add(face);
    }
  }
  assert.ok(seen.has("skull"));
  assert.ok(seen.has("whiteShield"));
  assert.ok(seen.has("blackShield"));
}

function testCounters() {
  const faces = ["skull", "whiteShield", "blackShield", "blackShield"];
  assert.equal(dice.countHitsForHeroAttack(faces), 1);
  assert.equal(dice.countBlocksForHeroDefense(faces), 1);
  assert.equal(dice.countBlocksForMonsterDefense(faces), 2);
}

function testMindShockOverride() {
  const hero = {
    id: "h1",
    heroTypeId: "barbarian",
    name: "Hero",
    playerId: "p1",
    campaignId: "c1",
    bodyPointsMax: 8,
    bodyPointsCurrent: 8,
    mindPointsMax: 2,
    mindPointsCurrent: 0,
    attackDice: 3,
    defendDice: 2,
    gold: 0,
    equipped: {
      weaponMain: { instanceId: "i1", itemId: "broadsword" },
      armorBody: { instanceId: "i2", itemId: "plate_armour" },
    },
    inventory: [],
    consumables: [],
    artifacts: [],
    spellsChosenThisQuest: [],
    statusFlags: { isDead: false, isInShock: true },
  };
  const effective = shared.resolveEffectiveHeroDice(hero);
  assert.equal(effective.attack, 1);
  assert.equal(effective.defend, 2);
  assert.ok(typeof effective.note === "string" && effective.note.includes("Mind Shock"));
}

function run() {
  testDiceFaces();
  testCounters();
  testMindShockOverride();
  console.log("dice smoke checks passed");
}

run();
