export const GOATCOUNTER = 'https://oliverohrt.goatcounter.com';

export const toDigits = (visits: number) => String(visits).padStart(7, '0').split('');

let pending: Promise<number> | undefined;

export function fetchVisits(): Promise<number> {
  pending ??= fetch(`${GOATCOUNTER}/counter/TOTAL.json`, { signal: AbortSignal.timeout(5000) })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => Number(data.count.replace(/\D/g, '')));
  return pending;
}
