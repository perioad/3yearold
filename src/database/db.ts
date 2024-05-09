import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb';

const tableName = process.env.TABLE_NAME || '';
const tableKey = process.env.TABLE_KEY || '';
const client = new DynamoDBClient({ region: process.env.REGION });
const docClient = DynamoDBDocumentClient.from(client);

export async function saveTrend(trend: string): Promise<void> {
  try {
    console.log('Saving trend:', trend);

    const command = new UpdateCommand({
      TableName: tableName,
      Key: {
        key: tableKey,
      },
      UpdateExpression:
        'SET trendsList = list_append(if_not_exists(trendsList, :emptyList), :newTrend)',
      ExpressionAttributeValues: {
        ':newTrend': [trend],
        ':emptyList': [],
      },
    });

    await docClient.send(command);
  } catch (error: unknown) {
    console.error('Failed to save trend:', error);
  }
}

export async function getUsedTrends(): Promise<string[]> {
  try {
    console.log('Getting trends');

    const command = new GetCommand({
      TableName: tableName,
      Key: {
        key: tableKey,
      },
    });

    const response = await docClient.send(command);
    const trends = response.Item?.trendsList;

    if (!trends?.length) {
      console.log('No trends found');

      return [];
    }

    return trends;
  } catch (error: unknown) {
    console.error('Failed to get trends:', error);

    return [];
  }
}
