import { TwitterApi } from 'twitter-api-v2';

export async function tweet(text: string): Promise<void> {
  const appKey = process.env.TWITTER_APP_KEY || '';
  const appSecret = process.env.TWITTER_APP_SECRET || '';
  const accessToken = process.env.TWITTER_ACCESS_TOKEN || '';
  const accessSecret = process.env.TWITTER_ACCESS_SECRET || '';

  const client = new TwitterApi({
    appKey,
    appSecret,
    accessToken,
    accessSecret,
  });

  try {
    const tweet = await client.v2.tweet(text);

    console.log('Tweet posted successfully:', tweet);
  } catch (error) {
    console.error('Failed to post tweet:', error);
  }
}
