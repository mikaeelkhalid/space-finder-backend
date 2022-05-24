import { v4 as uuid } from 'uuid';

async function handler(event: any, context: any) {
  console.log('An event: ', event);
  return {
    statusCode: 200,
    body: 'Hello World! ' + uuid(),
  };
}

export { handler };
