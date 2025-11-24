export enum AmPm {
  AM = 'AM',
  PM = 'PM'
}

export interface TimeState {
  hour: number;
  minute: number;
  ampm: AmPm;
}

export interface SleepCycle {
  time: Date;
  cycles: number;
  label: string; // e.g., "Suggested", "Good", "Okay"
}

export interface AdviceResponse {
  tip: string;
}
