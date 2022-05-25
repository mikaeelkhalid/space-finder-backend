import { DynamoDB } from 'aws-sdk';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { v4 as uuid } from 'uuid';

const dbClient = new DynamoDB.DocumentClient();

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: 'hello from dynamoDB',
  };

  const item = {
    spaceid: uuid(),
  };

  try {
    await dbClient
      .put({
        TableName: 'SpaceTable',
        Item: item,
      })
      .promise();
  } catch (error: any) {
    result.body = error.message;
  }

  return result;
}

export { handler };
