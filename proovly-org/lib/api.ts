export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export type AnalyticsSummary = {
  totalDonations: number;
  byRegion: Array<{ region: string; amount: number }>;
  chainVerifiedPct: number;
  from?: string;
  to?: string;
};

export async function getAnalyticsSummary(params?: { from?: string; to?: string; region?: string }) {
  const url = new URL(`${API_BASE_URL}/analytics/summary`);
  if (params?.from) url.searchParams.set("from", params.from);
  if (params?.to) url.searchParams.set("to", params.to);
  if (params?.region) url.searchParams.set("region", params.region);

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Failed to load analytics: ${res.status}`);
  }
  const data = (await res.json()) as AnalyticsSummary;
  return data;
}

export async function getAnalyticsByRegions(regions: string[]) {
  const results: Array<{ region: string; amount: number }> = [];
  await Promise.all(
    regions.map(async (region) => {
      try {
        const data = await getAnalyticsSummary({ region });
        const amount = Array.isArray(data.byRegion) && data.byRegion[0]?.amount ? data.byRegion[0].amount : 0;
        results.push({ region, amount });
      } catch {
        results.push({ region, amount: 0 });
      }
    })
  );
  // Keep input order
  return regions.map((r) => results.find((x) => x.region === r) || { region: r, amount: 0 });
}
