import OpenAI from 'openai';
import { ChatCompletionUserMessageParam } from 'openai/resources/index.mjs';
import {
  getHashtagFromTrend,
  getPrompt,
  getTweetWithHashtags,
} from '../utils/twitter.utils';

const ai: OpenAI = new OpenAI({ apiKey: process.env.OPENAI_KEY });

export async function getTweet(
  trend: string,
  retries = 0
): Promise<string | null> {
  const tweetExpectedLength =
    Number(process.env.TWEET_EXPECTED_LENGTH || 220) - retries * 10;
  const trendHashtag = getHashtagFromTrend(trend);
  const maxRetries = 3;

  if (retries > maxRetries) {
    console.log('Max retries reached');

    return null;
  }

  try {
    const messages: ChatCompletionUserMessageParam[] = [
      {
        role: 'user',
        content: getPrompt(trend, tweetExpectedLength),
      },
    ];
    const completion = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL || '',
      temperature: Number(process.env.OPENAI_TEMPERATURE || 0.5),
      messages,
      response_format: {
        type: 'json_object',
      },
    });
    const response = completion.choices[0].message;

    console.log('response: ', response);

    if (!response?.content) {
      console.log('No response content found');

      return null;
    }

    const newTweet = JSON.parse(response.content)?.text as string;

    if (!newTweet) {
      console.log('No new tweet found');

      return null;
    }

    const newTweetWithHashtags = getTweetWithHashtags(newTweet, trendHashtag);

    if (newTweetWithHashtags.length > 280) {
      console.log('Tweet too long:', newTweetWithHashtags);

      return await this.getTweet(trend, retries + 1);
    }

    return newTweetWithHashtags;
  } catch (error: unknown) {
    console.error('Failed to get tweet:', error);

    return null;
  }
}
