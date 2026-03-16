export type Difficulty = "easy" | "medium" | "hard";

export type FishBehavior = "peaceful" | "semi-aggressive" | "aggressive";

export type FishGrouping = "solo" | "pairs" | "school" | "group";

export type LightLevel = "low" | "medium" | "high";

export type PlantGrowthRate = "slow" | "medium" | "fast";

export type PlantPlacement =
  | "foreground"
  | "midground"
  | "background"
  | "floating";

export interface WaterParams {
  phMin: number;
  phMax: number;
  tempMin: number; // in Celsius
  tempMax: number;
  ghMin: number; // dGH
  ghMax: number;
  no3Max?: number; //ppm - optional
}

export interface Fish {
  id: string;
  imageUrl?: string;
  name: string; //Vietnamese name
  nameEn: string; //English name
  scientific: string; //Scientific name
  family: string;
  difficulty: Difficulty;
  behavior: FishBehavior;
  grouping: FishGrouping;
  minSchoolSize?: number; // when grouping === 'school'
  params: WaterParams;
  minTankLiters: number;
  maxSizeCm: number;
  lifespanYears: [number, number];
  diet: string[];
  compatibleWith: string[]; // Array fish IDs
  incompatibleWith: string[]; // Array fish IDs
  description: string;
  tags: string[];
}

export interface Plant {
  id: string;
  imageUrl?: string;
  name: string; // Vietnamese name
  nameEn: string; // English name
  scientific: string; // Scientific name
  difficulty: Difficulty;
  light: LightLevel;
  requiresCO2: boolean;
  growthRate: PlantGrowthRate;
  placement: PlantPlacement;
  heightCm: [number, number];
  params: Pick<WaterParams, "phMin" | "phMax" | "tempMin" | "tempMax">;
  description: string;
  tags: string[];
}

export type ReminderType =
  | "water-change"
  | "fertilizer"
  | "params-check"
  | "filter-clean"
  | "custom";

export type ReminderFrequency =
  | "daily"
  | "every-3-days"
  | "weekly"
  | "biweekly"
  | "monthly";

export interface Reminder {
  id: string;
  tankId: string;
  type: ReminderType;
  label: string;
  frequency: ReminderFrequency;
  nextDue: string; //ISO date string
  lastDone?: string;
  enabled: boolean;
}

export interface Tank {
  id: string;
  name: string;
  volumeLiters: number;
  setupDate: string; // ISO date string
  fishIds: string[];
  plantIds: string[];
  reminders: Reminder[];
  notes?: string;
}
