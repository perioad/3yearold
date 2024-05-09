import { parseHTML } from 'linkedom';
import { getUsedTrends, saveTrend } from '../database/db';

export async function getTrend(): Promise<string | null> {
  const trends = await getCurrentTrends();

  if (!trends.length) {
    return null;
  }

  const usedTrends = await getUsedTrends();

  for (const trend of trends) {
    if (!usedTrends.includes(trend.trim().toLowerCase())) {
      await saveTrend(trend.trim().toLowerCase());

      return trend;
    }

    console.log('Trend already used:', trend);
  }

  return null;
}

async function getCurrentTrends(): Promise<string[]> {
  try {
    const resp = await fetch('https://trends24.in/united-states');
    const text = await resp.text();
    const { document } = parseHTML(text);
    const [trendCard] = document.querySelectorAll('.trend-card');
    const trendItems = trendCard.querySelectorAll('a');

    let trends: (string | null)[] = [];

    for (const trendItem of trendItems) {
      trends.push(trendItem.textContent);
    }

    return trends.filter(Boolean) as string[];
  } catch (error) {
    console.error('Failed to get current trends:', error);

    return [];
  }
}
