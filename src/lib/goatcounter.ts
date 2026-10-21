export const GOATCOUNTER = 'https://oliverohrt.goatcounter.com';

export function fetchVisits(): Promise<number> {
  return fetch(`${GOATCOUNTER}/counter/TOTAL.json`, { signal: AbortSignal.timeout(5000) })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => Number(data.count.replace(/\D/g, '')));
}
