import * as fileType from 'file-type';
import { v4 as uuid } from 'uuid';
import * as AWS from 'aws-sdk';

const s3 = new AWS.S3();

export const handler = async (event: any): Promise<any> => {
    try {
        const body = JSON.parse(event.body);
        if(!body){
            return {
                statusCode: 400,
                message: 'Missing File!',
            };
        }
        let fileItem = body.file;
        const buffer = Buffer.from(fileItem, 'base64');
        const fileInfo = await fileType.fromBuffer(buffer);
        const detectedExt = fileInfo?.ext;

        const name = uuid();
        const key = `${name}.${detectedExt}`;

        await s3
        .putObject({
            Body: buffer,
            Key: key,
            ContentType: body.mime,
            Bucket: "upload-any-file-type"!,
        })
        .promise();
        const response = {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            body: JSON.stringify({ message: 'File has been successfully uploaded' })
            };
            return response;
    } catch(error){
        return {
            statusCode: 500,
            message: error
        }
    }
}