import { v4 as uuid } from 'uuid';
import { S3 } from 'aws-sdk';

const s3Client = new S3();

async function handler(event: any, context: any) {
  const buckets = await s3Client.listBuckets().promise();
  console.log(buckets);
  return {
    statusCode: 200,
    body: 'here are your buckets: ' + JSON.stringify(buckets.Buckets),
  };
}

export { handler };
