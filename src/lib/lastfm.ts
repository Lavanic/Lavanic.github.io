// Read-only key so it's ok here... I think.
const LASTFM_KEY = '52f94a497db597d18bc7023b38097315';
const LASTFM_URL = 'https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks'
  + '&user=oliverohrt&limit=1&format=json&api_key=' + LASTFM_KEY;

export type Artist = { name: string; title?: string };

export async function fetchArtist(): Promise<Artist | null> {
  const res = await fetch(LASTFM_URL, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const track = (await res.json())?.recenttracks?.track?.[0];
  const name = track?.artist?.['#text'];
  if (!name) return null;
  const playing = track['@attr']?.nowplaying === 'true';
  return {
    name,
    title: track.name ? `${playing ? 'Playing' : 'Last played'}: ${track.name}` : undefined,
  };
}
