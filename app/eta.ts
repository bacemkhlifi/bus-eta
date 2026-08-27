import type { Corridor } from "./data";
import { schedules } from "./data";

export function minutesFromTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function timeFromMinutes(value: number) {
  const minutes = ((value % 1440) + 1440) % 1440;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

export function kmOptions(maxKm: number) {
  const values: number[] = [];
  for (let km = 0; km <= maxKm; km += 0.5) {
    values.push(Number(km.toFixed(1)));
  }
  return values;
}

export function arrivalOffset(corridor: Corridor, km: number) {
  return Math.round(corridor.centerExitMinutes + km * corridor.minutesPerKm);
}

export function nextDepartures(lineCode: string, count = 3) {
  const schedule = schedules[lineCode];
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const first = minutesFromTime(schedule.first);
  const last = minutesFromTime(schedule.last);
  let next = first;

  if (nowMinutes > first) {
    next = first + Math.ceil((nowMinutes - first) / schedule.frequency) * schedule.frequency;
  }

  if (next > last) {
    next = first + 1440;
  }

  return Array.from({ length: count }, (_, index) => next + index * schedule.frequency);
}

export function currentDayMinute() {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}
