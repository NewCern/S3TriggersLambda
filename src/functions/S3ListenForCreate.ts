import { S3Handler } from 'aws-lambda';
import { S3EventRecord } from 'aws-lambda/trigger/s3';

export const handler: S3Handler = async (event): Promise<any> => {
  try {
    // Process the S3 create event
    const records: S3EventRecord[] = event.Records;
    for (const record of records) {
      if (record.eventName === 'ObjectCreated:Put') {
        const bucketName: string = record.s3.bucket.name;
        const objectKey: string = record.s3.object.key;

        // Perform actions on the newly created object
        console.log(`New object created in bucket: ${bucketName}`);
        console.log(`Object key: ${objectKey}`);
        // ... additional processing logic
      }
    }

    // Return a successful response
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'S3 create event processed' }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'An error occurred' }),
    };
  }
};
