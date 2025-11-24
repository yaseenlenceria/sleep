import { TimeState, AmPm, SleepCycle } from "../types";

export const FALL_ASLEEP_MINUTES = 15;
export const CYCLE_MINUTES = 90;

/**
 * Converts TimeState to a Date object (for today/tomorrow)
 */
export const timeStateToDate = (time: TimeState): Date => {
  const now = new Date();
  let target = new Date(now);
  
  let hours = time.hour;
  if (time.ampm === AmPm.PM && hours !== 12) hours += 12;
  if (time.ampm === AmPm.AM && hours === 12) hours = 0;

  target.setHours(hours, time.minute, 0, 0);

  // If the time has already passed today, assume tomorrow
  if (target.getTime() < now.getTime() - 60000) { // buffer
     // However, this logic depends on context. 
     // For "Wake up at", usually tomorrow.
     // For "Bedtime now", it's now.
     // We will handle date shifts in the specific calc functions.
  }
  
  return target;
};

export const formatTime = (date: Date): string => {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  
  const strMinutes = minutes < 10 ? '0' + minutes : minutes;
  
  return `${hours}:${strMinutes} ${ampm}`;
};

/**
 * Calculate bedtimes if I want to wake up at X
 * Formula: WakeTime - 15min - (N * 90min)
 */
export const calculateBedtimes = (wakeTime: TimeState): SleepCycle[] => {
  const now = new Date();
  let wakeDate = timeStateToDate(wakeTime);
  
  // If wake time is earlier than now, assume it's tomorrow
  if (wakeDate.getTime() < now.getTime()) {
    wakeDate.setDate(wakeDate.getDate() + 1);
  }

  const results: SleepCycle[] = [];
  
  // We usually show 4-6 cycles back
  const cyclesToShow = [6, 5, 4, 3]; 

  cyclesToShow.forEach(cycleCount => {
    const duration = (cycleCount * CYCLE_MINUTES) + FALL_ASLEEP_MINUTES;
    const bedtime = new Date(wakeDate.getTime() - (duration * 60000));
    
    let label = "Good";
    if (cycleCount === 5 || cycleCount === 6) label = "Suggested";
    if (cycleCount === 3) label = "Short nap";

    results.push({
      time: bedtime,
      cycles: cycleCount,
      label
    });
  });

  return results.reverse(); // Show earliest time first
};

/**
 * Calculate wake times if I go to bed NOW
 * Formula: Now + 15min + (N * 90min)
 */
export const calculateWakeTimes = (): SleepCycle[] => {
  const now = new Date();
  const fallAsleepTime = new Date(now.getTime() + (FALL_ASLEEP_MINUTES * 60000));
  
  const results: SleepCycle[] = [];
  const cyclesToShow = [1, 2, 3, 4, 5, 6];

  cyclesToShow.forEach(cycleCount => {
    const duration = cycleCount * CYCLE_MINUTES;
    const wakeTime = new Date(fallAsleepTime.getTime() + (duration * 60000));
    
    let label = "Power Nap";
    if (cycleCount >= 4) label = "Good";
    if (cycleCount >= 5) label = "Suggested";

    results.push({
      time: wakeTime,
      cycles: cycleCount,
      label
    });
  });

  return results;
};