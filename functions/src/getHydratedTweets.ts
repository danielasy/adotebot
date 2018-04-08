import * as AWS from 'aws-sdk';
import * as Twit from 'twit';

/**
 * AWS SDK configuration
 */
AWS.config.update({ region: 'us-east-1' });

// Create DynamoDB service object
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

/**
 * GET tweets with a certain review_status
 */
export const getTweetsWithReviewStatus = (
  reviewStatus: string,
  lastEvaluatedKey: any,
  callback: (error?: Error | null, result?: any) => void,
) => {
  dynamodb.query({
    TableName: process.env.DYNAMODB_TABLE,
    IndexName: 'ReviewStatusIndex',
    KeyConditionExpression: '#key = :val',
    ExpressionAttributeNames: {
      '#key': 'review_status',
    },
    ExpressionAttributeValues: {
      ':val': {
        S: reviewStatus,
      },
    },
    ProjectionExpression: 'id',
    Limit: 20,
    ExclusiveStartKey: lastEvaluatedKey,
  }, function(err, dynamodbData) {
    if (err) {
      callback(err);
      return;
    }

    const idList = dynamodbData.Items.map((item) => item.id.S).join(',');

    const T = new Twit({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token: process.env.TWITTER_ACCESS_TOKEN, 
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    T.get('statuses/lookup', {
      id: idList,
      tweet_mode: 'extended',
    }, function(err, twitData) {
      if (err) {
        callback(err);
        return;
      }

      callback(null, {
        data: twitData,
        count: dynamodbData.Count,
        lastEvaluatedKey: dynamodbData.LastEvaluatedKey,
      });
    });
  });
};
