export interface PredictionInputs {
  station_load: number;           // 0-100  | weight: 0.535
  time_slot_index: number;        // 0 or 1  | weight: 0.208
  traffic_density_index: number;  // 0,0.5,1 | weight: 0.168
  hour_of_day: number;            // 0-23    | weight: 0.052
  renewable_energy_ratio: number; // 0-100   | weight: 0.025
}

export interface PredictionResult {
  demand: number;
  level: 'Low' | 'Moderate' | 'High' | 'Critical';
  cluster: 0 | 1 | 2 | 3;
  color: string;
  confidence: number;
}

// Feature importances from PySpark RF model
const WEIGHTS = {
  station_load:           0.535,
  time_slot_index:        0.208,
  traffic_density_index:  0.168,
  hour_of_day:            0.052,
  renewable_energy_ratio: 0.025,
  // remaining ~0.012 from minor features → absorbed as a small constant baseline
};
const MINOR_BASELINE = 0.012; // fixed contribution from the 9 dropped features at average value

function hourScore(h: number): number {
  if (h >= 7  && h <= 10) return 0.85 + Math.sin(((h - 7)  / 3) * Math.PI) * 0.15;
  if (h >= 17 && h <= 21) return 0.90 + Math.sin(((h - 17) / 4) * Math.PI) * 0.10;
  if (h >= 11 && h <= 16) return 0.45 + Math.cos(((h - 11) / 5) * Math.PI * 0.5) * 0.10;
  return h === 6 || h === 22 ? 0.25 : 0.05;
}

export function predict(inputs: PredictionInputs): PredictionResult {
  const score =
    (inputs.station_load / 100)           * WEIGHTS.station_load +
    inputs.time_slot_index                * WEIGHTS.time_slot_index +
    inputs.traffic_density_index          * WEIGHTS.traffic_density_index +
    hourScore(inputs.hour_of_day)         * WEIGHTS.hour_of_day +
    (inputs.renewable_energy_ratio / 100) * WEIGHTS.renewable_energy_ratio +
    MINOR_BASELINE;

  const demand = Math.max(25, Math.min(90, 25 + score * 65));

  const level: PredictionResult['level'] =
    demand >= 75 ? 'Critical' :
    demand >= 60 ? 'High' :
    demand >= 40 ? 'Moderate' : 'Low';

  const color =
    demand >= 75 ? '#ff1744' :
    demand >= 60 ? '#ffab00' :
    demand >= 40 ? '#00e5ff' : '#00e676';

  // K-Means cluster heuristic (time slot + traffic are the two strongest predictors)
  let cluster: 0 | 1 | 2 | 3;
  if (inputs.time_slot_index === 1 && inputs.traffic_density_index >= 0.5) {
    cluster = 0; // Peak Hour Users
  } else if (inputs.time_slot_index === 1 && inputs.traffic_density_index < 0.5) {
    cluster = 1; // Quick Top-Up
  } else if (inputs.time_slot_index === 0 && inputs.station_load < 40) {
    cluster = 3; // Off-Peak Users
  } else {
    cluster = 2; // Regular Moderate
  }

  const confidence = Math.min(99, Math.round(88 + score * 8));
  return { demand, level, cluster, color, confidence };
}

export const FEATURE_IMPORTANCES = [
  { feature: 'Station Load', importance: 0.535, color: '#00e676' },
  { feature: 'Time Slot', importance: 0.208, color: '#00e5ff' },
  { feature: 'Traffic Density', importance: 0.168, color: '#2979ff' },
  { feature: 'Hour of Day', importance: 0.052, color: '#7c3aed' },
  { feature: 'Renewable Ratio', importance: 0.025, color: '#ff9100' },
  { feature: 'Other Features', importance: 0.012, color: '#546e7a' },
];

export const CLUSTERS = [
  { id: 0, label: 'Peak Hour Users', pct: 25.0,   icon: '⚡', color: '#ff1744' },
  { id: 1, label: 'Quick Top-Up',    pct: 22.3,   icon: '🔋', color: '#ffab00' },
  { id: 2, label: 'Regular Moderate',pct: 33.6,   icon: '📊', color: '#00e5ff' },
  { id: 3, label: 'Off-Peak Users',  pct: 19.1,   icon: '🌙', color: '#00e676' },
];

export const HOURLY_BASE = [
  25, 24, 24, 25, 26, 30, 45, 84, 85, 83, 71, 52,
  50, 48, 51, 50, 65, 85, 86, 84, 76, 55, 40, 30,
];
