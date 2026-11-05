import type { PartType } from '../models/Part.model';

const ENGINE_PART_PATTERN = /engine|cylinder|piston|crankshaft|camshaft|timing|turbocharger|turbo|fuel injector|injector|alternator|spark\s*plug|intake|engine mount|oil pump/i;
const TRANSMISSION_PART_PATTERN = /transmission|gear\s*box|gearbox|clutch|torque converter|transaxle|gear set/i;

export function classifyPartType(part: string, description = ''): PartType | null {
  const text = `${part} ${description}`;
  if (TRANSMISSION_PART_PATTERN.test(text)) return 'transmission';
  if (ENGINE_PART_PATTERN.test(text)) return 'engine';
  return null;
}
                                                      