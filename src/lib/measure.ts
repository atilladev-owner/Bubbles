export type Halved = { value: string; asWritten: boolean };

export function halve(value: string): Halved {
  return { value, asWritten: true };
}
