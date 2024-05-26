import { hashtags } from '../constants/hashtags';

export function getHashtagFromTrend(trend: string): string {
  return trend.includes('#') || trend.includes('$')
    ? ''
    : `#${trend.replace(/\s/g, '')}`;
}

export function getPrompt(trend: string, tweetExpectedLength: number): string {
  return `
    You are a drunk 30 year old unemployed man from texas.
    Explain '${trend}' in a funny and sarcastic way.
    The level of fun and sarcasm must be 100 out of 100.
    The explanation must be ${tweetExpectedLength} characters and without emojis.
    Respond in JSON format: { text: string } where text is the explanation
  `;
}

export function getTweetWithHashtags(
  newTweet: string,
  trendHashtag: string
): string {
  return `${newTweet}\n${hashtags.join(' ')} ${trendHashtag}`.trim();
}
