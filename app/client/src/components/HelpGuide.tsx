interface Props {
  onClose: () => void;
}

export default function HelpGuide({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* Drawer */}
      <div className="relative ml-auto h-full w-full max-w-2xl bg-hq-dark overflow-y-auto flex flex-col shadow-2xl border-l border-hq-brown">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-hq-dark border-b border-hq-brown px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display text-hq-amber">User Guide</h2>
            <p className="text-xs text-parchment/50">HeroQuest Companion App</p>
          </div>
          <button
            onClick={onClose}
            className="text-parchment/50 hover:text-parchment text-2xl leading-none px-2"
            aria-label="Close guide"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-10 text-parchment text-sm leading-relaxed">

          {/* ─── Quick Start ──────────────────────────────────────────── */}
          <section>
            <h3 className="section-heading">Quick Start</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="card">
                <p className="text-hq-amber font-bold mb-2">Game Master</p>
                <ol className="list-decimal list-inside space-y-1 text-parchment/80">
                  <li>Open the app → <strong>New Campaign</strong></li>
                  <li>Name your campaign, select expansions</li>
                  <li>Click <strong>Create Campaign (GM)</strong></li>
                  <li>Share the 6-character join code with players</li>
                  <li>Select a quest, then <strong>Start Session</strong></li>
                </ol>
              </div>
              <div className="card">
                <p className="text-hq-amber font-bold mb-2">Player</p>
                <ol className="list-decimal list-inside space-y-1 text-parchment/80">
                  <li>Open the app → <strong>Join Campaign</strong> tab</li>
                  <li>Enter the 6-character code from your GM</li>
                  <li>Select your hero</li>
                  <li>Your character sheet opens automatically</li>
                </ol>
              </div>
            </div>
          </section>

          {/* ─── Game Master Guide ────────────────────────────────────── */}
          <section>
            <h3 className="section-heading">Game Master Guide</h3>

            <div className="space-y-6">
              <div>
                <h4 className="subsection-heading">Campaigns</h4>
                <ul className="guide-list">
                  <li><strong>Create</strong> — Home screen → New Campaign tab. Choose a name and which expansions are active.</li>
                  <li><strong>Resume</strong> — If you've GM'd before, a <em>Previous Campaign</em> banner appears at the top of the home screen. Click <strong>Return</strong> to jump straight back in.</li>
                  <li><strong>Expansions</strong> — Base Game includes Barbarian, Dwarf, Elf and Wizard. Rise of the Dread Moon adds the Knight hero plus additional quests.</li>
                </ul>
              </div>

              <div>
                <h4 className="subsection-heading">Quest Management (Quests tab)</h4>
                <ul className="guide-list">
                  <li><strong>Select a quest</strong> by clicking its name. The selected quest is used when you start the next session.</li>
                  <li><strong>Unlock</strong> — Click the <em>Unlock</em> button next to any locked quest to make it available to play.</li>
                  <li><strong>Complete</strong> — During a session, click <em>Mark Quest Completed</em>. The next quest in the log unlocks automatically.</li>
                  <li>Completed quests show a green ✓. Locked quests show a lock icon and cannot be selected.</li>
                </ul>
              </div>

              <div>
                <h4 className="subsection-heading">Sessions (Session tab)</h4>
                <ul className="guide-list">
                  <li>Click <strong>Start Session</strong> to begin play. A join code is shown — share it with your players.</li>
                  <li>Click <strong>End Session</strong> when the quest is finished.</li>
                  <li><strong>Rooms</strong> — Click <em>Reveal</em> on any room to expose it. Monsters defined for that room in the quest spawn automatically.</li>
                  <li><strong>Monsters</strong> — Each spawned monster shows its current and maximum BP. Use +/− to track damage. Click <em>Remove</em> when defeated.</li>
                  <li>You can also <strong>manually spawn</strong> any monster type with a custom label.</li>
                </ul>
              </div>

              <div>
                <h4 className="subsection-heading">Party Management (Party tab)</h4>
                <ul className="guide-list">
                  <li>All heroes in the campaign are listed with live BP and MP.</li>
                  <li>Expand any hero to manage their inventory:</li>
                </ul>
                <ul className="guide-list ml-4 mt-1">
                  <li><strong>Gold</strong> — enter a positive or negative amount and click <em>Award</em> to adjust.</li>
                  <li><strong>Equipment</strong> — add weapons or armor; optionally set ATK/DEF bonuses. Remove items with ✕.</li>
                  <li><strong>Consumables</strong> — add healing potions, herbs, or holy water.</li>
                </ul>
              </div>

              <div>
                <h4 className="subsection-heading">Dice Rolls</h4>
                <p className="text-parchment/80">Whenever a player rolls dice, a toast notification appears at the bottom of your screen showing the player's name, roll type, and results. No action needed from the GM.</p>
              </div>
            </div>
          </section>

          {/* ─── Player Guide ─────────────────────────────────────────── */}
          <section>
            <h3 className="section-heading">Player Guide</h3>

            <div className="space-y-6">
              <div>
                <h4 className="subsection-heading">Joining &amp; Choosing a Hero</h4>
                <ul className="guide-list">
                  <li>Enter the GM's join code on the home screen → <strong>Join as Player</strong>.</li>
                  <li>On the lobby screen, pick an available hero. Heroes already taken by another player are greyed out.</li>
                  <li>Give your hero a name, then click <strong>Create Hero</strong> to open your character sheet.</li>
                </ul>
              </div>

              <div>
                <h4 className="subsection-heading">Stats Tab</h4>
                <ul className="guide-list">
                  <li><strong>Body Points (BP)</strong> — your health. Dropping to 0 means death.</li>
                  <li><strong>Mind Points (MP)</strong> — mental fortitude. Dropping to 0 puts you in shock.</li>
                  <li>Use the <strong>+/−</strong> buttons to track hits and healing. You can only adjust your own hero; the GM can adjust anyone.</li>
                  <li><strong>Roll Attack</strong> / <strong>Roll Defense</strong> — rolls your effective dice (base dice + equipment bonuses) and broadcasts the result to the entire party and GM.</li>
                </ul>
              </div>

              <div>
                <h4 className="subsection-heading">Inventory Tab</h4>
                <ul className="guide-list">
                  <li><strong>Equipment</strong> — weapons and armor with their ATK/DEF bonuses. Equipment bonuses are added automatically to your dice rolls.</li>
                  <li><strong>Consumables</strong> — tap <em>Use</em> to consume an item:
                    <ul className="ml-4 mt-1 space-y-0.5">
                      <li>Healing Potion — restores <strong>4 BP</strong></li>
                      <li>Healing Herb — restores <strong>2 BP</strong></li>
                      <li>Holy Water — cures shock (restores MP to at least 1)</li>
                    </ul>
                  </li>
                  <li><strong>Gold</strong> — enter an amount and click <em>Update</em> to change your gold. The party total is shown at the top.</li>
                </ul>
              </div>

              <div>
                <h4 className="subsection-heading">Spells Tab (Wizard &amp; Elf only)</h4>
                <p className="text-parchment/80 mb-2">
                  Spells are organized by element. You choose <em>elements</em>, not individual spells — choosing an element gives you all 4 spells in that school.
                </p>
                <div className="card mb-3">
                  <p className="text-hq-amber font-bold text-xs uppercase tracking-wider mb-2">3-Phase Selection</p>
                  <ol className="list-decimal list-inside space-y-1 text-parchment/80">
                    <li><strong>Wizard</strong> picks 2 elements from Air, Earth, Fire, Water.</li>
                    <li><strong>Elf</strong> picks 1 element from the 2 <em>not</em> chosen by the Wizard.</li>
                    <li>The remaining element is <strong>automatically assigned</strong> to the Wizard (who ends with 3 elements total).</li>
                  </ol>
                </div>
                <p className="text-parchment/60 text-xs">The Elf's available choices update in real time as the Wizard picks. The auto-assigned element is labelled in the Wizard's spell list.</p>
              </div>
            </div>
          </section>

          {/* ─── Hero Stats Reference ─────────────────────────────────── */}
          <section>
            <h3 className="section-heading">Hero Stats Reference</h3>
            <div className="overflow-x-auto">
              <table className="ref-table">
                <thead>
                  <tr>
                    <th>Hero</th><th>BP</th><th>MP</th><th>Attack Dice</th><th>Defense Dice</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Barbarian</td><td>8</td><td>2</td><td>3</td><td>2</td></tr>
                  <tr><td>Dwarf</td><td>7</td><td>3</td><td>2</td><td>2</td></tr>
                  <tr><td>Elf</td><td>6</td><td>4</td><td>2</td><td>2</td></tr>
                  <tr><td>Wizard</td><td>4</td><td>6</td><td>1</td><td>2</td></tr>
                  <tr><td>Knight <span className="text-hq-amber text-xs">*</span></td><td>7</td><td>4</td><td>2</td><td>3</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-parchment/50 mt-1">* Knight requires the Rise of the Dread Moon expansion.</p>
          </section>

          {/* ─── Monster Stats Reference ──────────────────────────────── */}
          <section>
            <h3 className="section-heading">Monster Stats Reference</h3>
            <div className="overflow-x-auto">
              <table className="ref-table">
                <thead>
                  <tr>
                    <th>Monster</th><th>BP</th><th>Attack Dice</th><th>Defense Dice</th><th>Movement</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Goblin</td><td>1</td><td>2</td><td>1</td><td>10</td></tr>
                  <tr><td>Skeleton</td><td>1</td><td>2</td><td>2</td><td>6</td></tr>
                  <tr><td>Zombie</td><td>2</td><td>2</td><td>2</td><td>6</td></tr>
                  <tr><td>Orc</td><td>2</td><td>3</td><td>2</td><td>6</td></tr>
                  <tr><td>Mummy</td><td>3</td><td>3</td><td>3</td><td>6</td></tr>
                  <tr><td>Chaos Warrior</td><td>3</td><td>3</td><td>4</td><td>6</td></tr>
                  <tr><td>Gargoyle</td><td>4</td><td>4</td><td>4</td><td>6</td></tr>
                  <tr><td className="text-hq-red font-bold">Witch Lord</td><td>6</td><td>4</td><td>6</td><td>6</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-parchment/50 mt-1">The Witch Lord also has 6 Mind Points.</p>
          </section>

          {/* ─── Gear Catalog ─────────────────────────────────────────── */}
          <section>
            <h3 className="section-heading">Gear Catalog</h3>

            <h4 className="subsection-heading">Weapons</h4>
            <div className="overflow-x-auto mb-4">
              <table className="ref-table">
                <thead>
                  <tr><th>Item</th><th>ATK Bonus</th><th>DEF Bonus</th><th>Cost</th></tr>
                </thead>
                <tbody>
                  <tr><td>Short Sword</td><td>+1</td><td>—</td><td>150g</td></tr>
                  <tr><td>Hand Axe</td><td>+1</td><td>—</td><td>200g</td></tr>
                  <tr><td>Spear</td><td>+1</td><td>—</td><td>200g</td></tr>
                  <tr><td>Broadsword</td><td>+2</td><td>—</td><td>350g</td></tr>
                  <tr><td>Battle Axe</td><td>+2</td><td>—</td><td>250g</td></tr>
                  <tr><td>Crossbow <span className="text-xs text-parchment/50">(ranged)</span></td><td>+2</td><td>—</td><td>300g</td></tr>
                  <tr><td>Magic Sword</td><td>+2</td><td>+1</td><td>500g</td></tr>
                </tbody>
              </table>
            </div>

            <h4 className="subsection-heading">Armor</h4>
            <div className="overflow-x-auto mb-4">
              <table className="ref-table">
                <thead>
                  <tr><th>Item</th><th>DEF Bonus</th><th>Cost</th></tr>
                </thead>
                <tbody>
                  <tr><td>Helmet</td><td>+1</td><td>150g</td></tr>
                  <tr><td>Shield</td><td>+1</td><td>150g</td></tr>
                  <tr><td>Cloak of Protection</td><td>+1</td><td>200g</td></tr>
                  <tr><td>Chain Mail</td><td>+2</td><td>300g</td></tr>
                  <tr><td>Plate Armour</td><td>+3</td><td>450g</td></tr>
                </tbody>
              </table>
            </div>

            <h4 className="subsection-heading">Consumables</h4>
            <div className="overflow-x-auto">
              <table className="ref-table">
                <thead>
                  <tr><th>Item</th><th>Effect</th><th>Cost</th></tr>
                </thead>
                <tbody>
                  <tr><td>Healing Potion</td><td>Restore 4 BP</td><td>100g</td></tr>
                  <tr><td>Healing Herb</td><td>Restore 2 BP</td><td>50g</td></tr>
                  <tr><td>Holy Water</td><td>Cure shock; restore MP to ≥ 1</td><td>75g</td></tr>
                  <tr><td>Talisman of Lore</td><td>+1 DEF; +2 MP for spellcasters</td><td>200g</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ─── Spells Reference ─────────────────────────────────────── */}
          <section>
            <h3 className="section-heading">Spells Reference</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                {
                  element: "Air",
                  color: "text-blue-300",
                  spells: [
                    ["Gust of Wind", "Move one monster up to 4 spaces"],
                    ["Swift Wind", "Move any hero up to 6 spaces"],
                    ["Tempest", "All monsters in room take 1 BP damage"],
                    ["Veil of Mist", "Attackers roll 1 fewer die until your next turn"],
                  ],
                },
                {
                  element: "Earth",
                  color: "text-yellow-700",
                  spells: [
                    ["Cave In", "Collapse a corridor, dealing damage and blocking passage"],
                    ["Pass Through Rock", "Move through walls this turn"],
                    ["Rock Skin", "Roll 2 extra defense dice until your next turn"],
                    ["Tremors", "All monsters in adjacent rooms take 1 BP damage"],
                  ],
                },
                {
                  element: "Fire",
                  color: "text-hq-red",
                  spells: [
                    ["Ball of Flame", "One monster takes 4 BP damage"],
                    ["Courage", "Remove mind effects; restore 2 Mind Points"],
                    ["Fire of Wrath", "All monsters in room take 1 BP damage"],
                    ["Wall of Fire", "Create impassable fire barrier in adjacent corridor"],
                  ],
                },
                {
                  element: "Water",
                  color: "text-cyan-400",
                  spells: [
                    ["Healing Water", "Restore up to 4 BP to yourself or adjacent hero"],
                    ["Healing Dew", "Restore 2 BP to yourself or adjacent hero"],
                    ["Ice Storm", "Monsters in room must pass Mind test or be stunned"],
                    ["Water of Strength", "Roll 2 extra attack dice until your next turn"],
                  ],
                },
              ].map(({ element, color, spells }) => (
                <div key={element} className="card">
                  <p className={`font-bold uppercase tracking-wider text-xs mb-2 ${color}`}>{element}</p>
                  <ul className="space-y-2">
                    {spells.map(([name, desc]) => (
                      <li key={name}>
                        <span className="font-semibold text-parchment">{name}</span>
                        <br />
                        <span className="text-xs text-parchment/60">{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <div className="text-center text-xs text-parchment/30 pt-4 border-t border-hq-brown">
            HeroQuest Companion — 2021 Hasbro HeroQuest Edition
          </div>
        </div>
      </div>
    </div>
  );
}
