import * as AWS from 'aws-sdk';

/**
 * AWS SDK configuration
 */
AWS.config.update({ region: 'us-east-1' });

// Create DynamoDB service object
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

/**
 * PUT review_status for a tweet
 */
export const updateReviewStatus = (
  id: string,
  reviewStatus: string,
  callback: (error?: Error | null, result?: any) => void,
) => {
  dynamodb.updateItem({
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: {
        S: id,
      },
    },
    UpdateExpression: "SET review_status = :new_status",
    ExpressionAttributeValues: { 
      ':new_status': {
        S: reviewStatus,
      },
    },
    ReturnValues: 'ALL_NEW',
  }, function(err, dynamodbData) {
    if (err) {
      callback(err);
      return;
    }

    callback(null, dynamodbData);
  });
}
