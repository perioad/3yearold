import { getTweet } from './ai/ai';
import { getTrend } from './trends/get-trend';
import { tweet } from './twitter/tweet';

export const handler = async () => {
  try {
    const ok = {
      statusCode: 200,
      body: 'ok',
    };

    const trend = await getTrend();

    console.log('trend: ', trend);

    if (!trend) {
      console.log('No new trend found');

      return ok;
    }

    const newTweet = await getTweet(trend);

    console.log('newTweet: ', newTweet);

    if (!newTweet) {
      console.log('No new tweet created');

      return ok;
    }

    await tweet(newTweet);

    return ok;
  } catch (error) {
    console.error('Handler error:', error);
  }
};
