export const STATUS_USER = 'oliverohrt';
export const STATUS_URL = `https://status.cafe/users/${STATUS_USER}`;

export type Status = { face: string; content: string; timeAgo: string };

let pending: Promise<Status> | undefined;

const PREVIEW: Status | null = {
  face: '⛰️',
  content: 'Just finished the Ha Giang motorcycle loop',
  timeAgo: '2 hours ago',
};

export function fetchStatus(): Promise<Status> {
  if (PREVIEW) return Promise.resolve(PREVIEW);
  pending ??= fetch(`${STATUS_URL}/status.json`, { signal: AbortSignal.timeout(5000) })
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((data) => {
      if (!data.content) throw new Error('empty status');
      return { face: data.face, content: data.content, timeAgo: data.timeAgo };
    });
  return pending;
}
