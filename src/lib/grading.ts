import { clamp, roundToNearest } from "./utils";

export type GradingMethod =
  | "n-term"
  | "percentage"
  | "fouten"
  | "goed"
  | "fixed-cutoff";

export interface GradingConfig {
  totalPoints: number;
  voldoende: number;
  method: GradingMethod;
  nTerm: number;
  passPercentage: number;
  foutenKFactor: number;
  goedKFactor: number;
  fixedCutoff: number;
  rounding: number;
}

export const DEFAULT_CONFIG: GradingConfig = {
  totalPoints: 50,
  voldoende: 5.5,
  method: "n-term",
  nTerm: 1.0,
  passPercentage: 55,
  foutenKFactor: 5,
  goedKFactor: 5,
  fixedCutoff: 27,
  rounding: 0.1,
};

export interface GradeResult {
  punten: number;
  fouten: number;
  cijfer: number;
  cijferRounded: number;
  isPassing: boolean;
}

/**
 * Calculate grade using N-term method
 * Formula: Grade = 9 * (Score / Total) + N
 */
function calculateNTerm(score: number, total: number, nTerm: number): number {
  return 9 * (score / total) + nTerm;
}

/**
 * Calculate grade using Percentage Normering (Cesuur %)
 * Piecewise Linear:
 * - Below Pass%: Scales linearly from 1.0 to Voldoende
 * - Above Pass%: Scales linearly from Voldoende to 10.0
 */
function calculatePercentage(
  score: number,
  total: number,
  passPercentage: number,
  voldoende: number
): number {
  const passPoints = (passPercentage / 100) * total;

  if (score <= passPoints) {
    // Below pass: scale from 1.0 to voldoende
    if (passPoints === 0) return voldoende;
    return 1.0 + ((voldoende - 1.0) * score) / passPoints;
  } else {
    // Above pass: scale from voldoende to 10.0
    const remainingPoints = total - passPoints;
    if (remainingPoints === 0) return 10.0;
    return voldoende + ((10.0 - voldoende) * (score - passPoints)) / remainingPoints;
  }
}

/**
 * Calculate grade using Fouten per punt method
 * Formula: Grade = 10 - (Mistakes / K_factor)
 */
function calculateFouten(
  score: number,
  total: number,
  kFactor: number
): number {
  const mistakes = total - score;
  return 10 - mistakes / kFactor;
}

/**
 * Calculate grade using Goed per punt method
 * Formula: Grade = 1 + (Score / K_factor)
 */
function calculateGoed(score: number, kFactor: number): number {
  return 1 + score / kFactor;
}

/**
 * Calculate grade using Fixed Cutoff (Punten Cesuur) method
 * Similar to Percentage, but uses exact point value for 5.5
 */
function calculateFixedCutoff(
  score: number,
  total: number,
  cutoffPoints: number,
  voldoende: number
): number {
  if (score <= cutoffPoints) {
    // Below cutoff: scale from 1.0 to voldoende
    if (cutoffPoints === 0) return voldoende;
    return 1.0 + ((voldoende - 1.0) * score) / cutoffPoints;
  } else {
    // Above cutoff: scale from voldoende to 10.0
    const remainingPoints = total - cutoffPoints;
    if (remainingPoints === 0) return 10.0;
    return voldoende + ((10.0 - voldoende) * (score - cutoffPoints)) / remainingPoints;
  }
}

/**
 * Calculate grade based on configuration
 */
export function calculateGrade(score: number, config: GradingConfig): number {
  const { totalPoints, voldoende, method } = config;

  let rawGrade: number;

  switch (method) {
    case "n-term":
      rawGrade = calculateNTerm(score, totalPoints, config.nTerm);
      break;
    case "percentage":
      rawGrade = calculatePercentage(
        score,
        totalPoints,
        config.passPercentage,
        voldoende
      );
      break;
    case "fouten":
      rawGrade = calculateFouten(score, totalPoints, config.foutenKFactor);
      break;
    case "goed":
      rawGrade = calculateGoed(score, config.goedKFactor);
      break;
    case "fixed-cutoff":
      rawGrade = calculateFixedCutoff(
        score,
        totalPoints,
        config.fixedCutoff,
        voldoende
      );
      break;
    default:
      rawGrade = 1.0;
  }

  return clamp(rawGrade, 1.0, 10.0);
}

/**
 * Generate all grade results for the table
 */
export function generateGradeTable(config: GradingConfig): GradeResult[] {
  const results: GradeResult[] = [];
  const { totalPoints, voldoende, rounding } = config;

  // Handle fractional total points
  const hasHalfPoints = totalPoints % 1 !== 0;
  const step = hasHalfPoints ? 0.5 : 1;

  for (let punten = totalPoints; punten >= 0; punten -= step) {
    const fouten = totalPoints - punten;
    const cijfer = calculateGrade(punten, config);
    const cijferRounded = roundToNearest(cijfer, rounding);
    const isPassing = cijferRounded >= voldoende;

    results.push({
      punten,
      fouten,
      cijfer,
      cijferRounded,
      isPassing,
    });
  }

  return results;
}

/**
 * Generate data points for the grade curve chart
 */
export function generateChartData(config: GradingConfig): Array<{
  punten: number;
  cijfer: number;
}> {
  const { totalPoints } = config;
  const data: Array<{ punten: number; cijfer: number }> = [];

  // Generate more points for a smoother curve
  const steps = Math.max(100, totalPoints * 2);
  for (let i = 0; i <= steps; i++) {
    const punten = (i / steps) * totalPoints;
    const cijfer = calculateGrade(punten, config);
    data.push({
      punten: Math.round(punten * 100) / 100,
      cijfer: Math.round(cijfer * 100) / 100,
    });
  }

  return data;
}

/**
 * Get method display name in Dutch
 */
export function getMethodDisplayName(method: GradingMethod): string {
  const names: Record<GradingMethod, string> = {
    "n-term": "N-term",
    percentage: "Cesuur %",
    fouten: "Fouten per punt",
    goed: "Goed per punt",
    "fixed-cutoff": "Punten Cesuur",
  };
  return names[method];
}

/**
 * Get method description in Dutch
 */
export function getMethodDescription(method: GradingMethod): string {
  const descriptions: Record<GradingMethod, string> = {
    "n-term": "Cijfer = 9 × (Score / Totaal) + N",
    percentage: "Lineaire schaal met cesuur percentage",
    fouten: "Cijfer = 10 - (Fouten / K)",
    goed: "Cijfer = 1 + (Score / K)",
    "fixed-cutoff": "Lineaire schaal met vast puntenaantal voor voldoende",
  };
  return descriptions[method];
}

/**
 * Convert grade table to TSV format for Excel export
 */
export function tableToTSV(results: GradeResult[], config: GradingConfig): string {
  const header = "Punten\tFouten\tCijfer";
  const rows = results.map(
    (r) =>
      `${r.punten}\t${r.fouten}\t${r.cijferRounded.toFixed(
        config.rounding < 1 ? (config.rounding === 0.01 ? 2 : 1) : 0
      )}`
  );
  return [header, ...rows].join("\n");
}
