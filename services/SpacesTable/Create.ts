import { DynamoDB } from 'aws-sdk';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { v4 as uuid } from 'uuid';

const dbClient = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME;

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: 'hello from dynamoDB',
  };

  const item =
    typeof event.body == 'object' ? event.body : JSON.parse(event.body);

  item.spaceid = uuid();

  try {
    await dbClient
      .put({
        TableName: TABLE_NAME!,
        Item: item,
      })
      .promise();
  } catch (error: any) {
    result.body = error.message;
  }

  result.body = JSON.stringify(`created item with id: ${item.spaceid}`);

  return result;
}

export { handler };
