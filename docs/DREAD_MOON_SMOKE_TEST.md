# Dread Moon Smoke Test (Step 2)

1. Start a campaign with `DREAD_MOON` enabled and start a Dread Moon quest.
2. Verify gated UI: Player Sheet and GM Dashboard show Dread Moon panels only when `session.rulesSnapshot.enabledSystems` enables them.
3. Disguise:
- Toggle disguise from GM or player.
- Try equipping illegal gear while disguised; verify socket error.
4. Reputation:
- GM runs `ADJUST_REPUTATION`; verify `PARTY_UPDATED` and visible token count update.
5. Mercenaries:
- Unlock a mercenary type, hire it, adjust HP, dismiss it.
- Verify all changes are reflected through `PARTY_UPDATED`.
6. Alchemy:
- Add/remove reagents, craft potion, draw random potion.
- Buy `Reagent Kit` in Underground Market and verify +5 uses tracked.
7. Mind Shock:
- Set hero MP to 0, open Player Sheet, confirm dice panel shows fixed 1 ATK / 2 DEF and note that gear bonuses are ignored.
8. Ethereal monsters:
- Toggle monster ethereal status in GM panel.
- Confirm reminder text states black shields are required for weapon attacks.
9. Hideout:
- Use hideout rest for a hero once; second attempt must fail with error.
10. Multiplayer sync:
- Join with GM + player clients and verify updates for hero/party/session are visible in both clients.
