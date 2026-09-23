export const WEEKS = 14;
const CONTRIBUTIONS_URL = 'https://github-contributions-api.jogruber.de/v4/Lavanic?y=last';

export type Day = { date: string; count: number; level: number };
export type Cell = { level: number; title: string };

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const ordinal = (d: number) =>
  d % 10 === 1 && d !== 11 ? 'st' : d % 10 === 2 && d !== 12 ? 'nd' : d % 10 === 3 && d !== 13 ? 'rd' : 'th';

export function toCells(days: Day[], total: number): Cell[] {
  const cols: Day[][] = [];
  for (const day of days) {
    const [y, m, d] = day.date.split('-').map(Number);
    if (cols.length === 0 || new Date(y, m - 1, d).getDay() === 0) cols.push([]);
    cols[cols.length - 1].push(day);
  }
  return cols.slice(-WEEKS).flat().slice(-total).map((day) => {
    const [, m, d] = day.date.split('-').map(Number);
    const n = day.count;
    return {
      level: day.level,
      title: `${n === 0 ? 'No' : n} contribution${n === 1 ? '' : 's'} on ${MONTHS[m - 1]} ${d}${ordinal(d)}.`,
    };
  });
}

let pending: Promise<Day[]> | undefined;

export function fetchDays(): Promise<Day[]> {
  pending ??= fetch(CONTRIBUTIONS_URL, { signal: AbortSignal.timeout(5000) })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => data.contributions);
  return pending;
}
