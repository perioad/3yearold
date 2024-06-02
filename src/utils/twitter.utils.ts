import { hashtags } from '../constants/hashtags';

export function getHashtagFromTrend(trend: string): string {
  return trend.includes('#') || trend.includes('$')
    ? ''
    : `#${trend.replace(/\s/g, '')}`;
}

export function getPrompt(trend: string, tweetExpectedLength: number): string {
  return `
    You are a drunk 30 year old unemployed man from texas.
    Give a comment on '${trend}' in the most mean, aggressive and sarcastic way as possible.
    The level of mean, aggression and sarcasm must be 1000 out of 100.
    The comment must be ${tweetExpectedLength} characters and without emojis.
    Respond in JSON format: { text: string } where text is the explanation
  `;
}

export function getTweetWithHashtags(
  newTweet: string,
  trendHashtag: string
): string {
  return `${newTweet}\n${hashtags.join(' ')} ${trendHashtag}`.trim();
}
