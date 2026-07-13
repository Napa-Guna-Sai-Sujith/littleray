// Central pricing engine for the interactive calculator.
// All amounts are in INR. State/city multipliers simulate market variation.

export type BhkOption = "1BHK" | "2BHK" | "3BHK" | "4BHK" | "Villa";
export type Tier = "budget" | "premium" | "luxury";
export type Room =
  | "living_room"
  | "master_bedroom"
  | "kids_bedroom"
  | "guest_bedroom"
  | "kitchen"
  | "dining"
  | "pooja"
  | "study";
export type Addon =
  | "false_ceiling"
  | "modular_wardrobe"
  | "smart_storage"
  | "tv_unit"
  | "lighting"
  | "wall_paneling";

export const BHK_BASE: Record<BhkOption, number> = {
  "1BHK": 180000,
  "2BHK": 320000,
  "3BHK": 480000,
  "4BHK": 640000,
  Villa: 900000,
};

export const TIER_MULTIPLIER: Record<Tier, number> = {
  budget: 1.0,
  premium: 1.45,
  luxury: 1.95,
};

export const ROOM_PRICES: Record<Room, number> = {
  living_room: 85000,
  master_bedroom: 95000,
  kids_bedroom: 70000,
  guest_bedroom: 65000,
  kitchen: 145000,
  dining: 55000,
  pooja: 35000,
  study: 45000,
};

export const ROOM_LABELS: Record<Room, string> = {
  living_room: "Living Room",
  master_bedroom: "Master Bedroom",
  kids_bedroom: "Kids Bedroom",
  guest_bedroom: "Guest Bedroom",
  kitchen: "Modular Kitchen",
  dining: "Dining Area",
  pooja: "Pooja Room",
  study: "Study / Home Office",
};

export const ADDON_PRICES: Record<Addon, number> = {
  false_ceiling: 45000,
  modular_wardrobe: 85000,
  smart_storage: 40000,
  tv_unit: 35000,
  lighting: 28000,
  wall_paneling: 55000,
};

export const ADDON_LABELS: Record<Addon, string> = {
  false_ceiling: "False Ceiling",
  modular_wardrobe: "Modular Wardrobe",
  smart_storage: "Smart Storage Solutions",
  tv_unit: "TV Unit & Console",
  lighting: "Designer Lighting Package",
  wall_paneling: "Wall Paneling",
};

export interface CalculateInput {
  bhk: BhkOption;
  tier: Tier;
  rooms: Room[];
  addons: Addon[];
  cityMultiplier?: number;
  stateMultiplier?: number;
}

export interface CalculateResult {
  base: number;
  roomsTotal: number;
  addonsTotal: number;
  subtotal: number;
  tierAdjustment: number;
  cityAdjustment: number;
  total: number;
  breakdown: Record<string, number>;
}

export function calculatePrice(input: CalculateInput): CalculateResult {
  const base = BHK_BASE[input.bhk];
  const roomsTotal = input.rooms.reduce(
    (sum, r) => sum + (ROOM_PRICES[r] ?? 0),
    0,
  );
  const addonsTotal = input.addons.reduce(
    (sum, a) => sum + (ADDON_PRICES[a] ?? 0),
    0,
  );

  const subtotal = base + roomsTotal + addonsTotal;
  const tierMult = TIER_MULTIPLIER[input.tier];
  const tierAdjusted = subtotal * tierMult;
  const tierAdjustment = tierAdjusted - subtotal;

  const cityMult = (input.cityMultiplier ?? 1) * (input.stateMultiplier ?? 1);
  const total = Math.round(tierAdjusted * cityMult);
  const cityAdjustment = total - tierAdjusted;

  const breakdown: Record<string, number> = {
    "Base package": base,
    "Selected rooms": roomsTotal,
    "Add-ons": addonsTotal,
    "Material tier": Math.round(tierAdjustment),
    "Regional adjustment": Math.round(cityAdjustment),
  };

  return {
    base,
    roomsTotal,
    addonsTotal,
    subtotal,
    tierAdjustment,
    cityAdjustment,
    total,
    breakdown,
  };
}

export function formatINR(n: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}
