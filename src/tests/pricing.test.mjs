import { test } from "node:test";
import assert from "node:assert/strict";

// Duplicate the pure functions here for CJS-free node --test runs.
const BHK_BASE = { "1BHK": 180000, "2BHK": 320000, "3BHK": 480000, "4BHK": 640000, Villa: 900000 };
const TIER = { budget: 1.0, premium: 1.45, luxury: 1.95 };
const ROOM = { living_room: 85000, master_bedroom: 95000, kitchen: 145000 };
const ADDON = { false_ceiling: 45000, modular_wardrobe: 85000 };

function calc({ bhk, tier, rooms, addons, cityMultiplier = 1, stateMultiplier = 1 }) {
  const base = BHK_BASE[bhk];
  const r = rooms.reduce((s, x) => s + (ROOM[x] ?? 0), 0);
  const a = addons.reduce((s, x) => s + (ADDON[x] ?? 0), 0);
  const sub = base + r + a;
  const tierAdj = sub * TIER[tier];
  return Math.round(tierAdj * cityMultiplier * stateMultiplier);
}

test("budget 2BHK with no rooms/addons equals base", () => {
  assert.equal(calc({ bhk: "2BHK", tier: "budget", rooms: [], addons: [] }), 320000);
});

test("premium tier increases price by 45%", () => {
  const budget = calc({ bhk: "2BHK", tier: "budget", rooms: [], addons: [] });
  const premium = calc({ bhk: "2BHK", tier: "premium", rooms: [], addons: [] });
  assert.equal(premium, Math.round(budget * 1.45));
});

test("adding rooms and addons increases price", () => {
  const bare = calc({ bhk: "3BHK", tier: "budget", rooms: [], addons: [] });
  const loaded = calc({ bhk: "3BHK", tier: "budget", rooms: ["kitchen", "living_room"], addons: ["false_ceiling"] });
  assert.ok(loaded > bare);
  assert.equal(loaded - bare, 145000 + 85000 + 45000);
});

test("city and state multipliers compound", () => {
  const base = calc({ bhk: "1BHK", tier: "budget", rooms: [], addons: [] });
  const scaled = calc({ bhk: "1BHK", tier: "budget", rooms: [], addons: [], cityMultiplier: 1.2, stateMultiplier: 1.1 });
  assert.equal(scaled, Math.round(base * 1.2 * 1.1));
});

test("villa base equals expected", () => {
  assert.equal(calc({ bhk: "Villa", tier: "budget", rooms: [], addons: [] }), 900000);
});
