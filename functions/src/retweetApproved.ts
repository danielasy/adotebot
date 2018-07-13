import * as AWS from 'aws-sdk';
import * as Twit from 'twit';

import { ReviewStatus } from './definitions';

/**
 * AWS SDK configuration
 */
AWS.config.update({region: 'us-east-1'});

// Create DynamoDB service object
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

/**
 * Retweet one approved tweet
 */
export const handler = () => {
  const T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN, 
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  dynamodb.query({
    TableName: process.env.DYNAMODB_TABLE,
    IndexName: 'ReviewStatusIndex',
    KeyConditionExpression: '#key = :val',
    ExpressionAttributeNames: {
      '#key': 'review_status',
    },
    ExpressionAttributeValues: {
      ':val': {
        S: 'APPROVED',
      },
    },
    ProjectionExpression: 'id',
    Limit: 1,
  }, function(err, dynamodbData) {
    if (dynamodbData && dynamodbData.Items && dynamodbData.Items[0]) {
      const id = dynamodbData.Items[0].id.S;

      T.post('statuses/retweet/:id', {
        id,
      }, function(err, twitData) {
        if (twitData) {
          console.info(`Retweeted status ${id} successfully`);

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
                S: ReviewStatus.RETWEETED,
              },
            },
          }, function(err, dynamodbUpdate) {
            if (dynamodbUpdate) {
              console.info(`DynamoDB data for ${id} updated`)
            } else if (err) {
              console.error(err);
            }
          });
        } else if (err) {
          console.error(err);
        }
      });
    } else if (err) {
      console.error(err);
    }
  });
};
