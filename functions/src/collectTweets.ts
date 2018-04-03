import * as AWS from 'aws-sdk';
import * as moment from 'moment';
import * as Twit from 'twit';

import { ReviewStatus } from './definitions';

/**
 * AWS SDK configuration
 */
AWS.config.update({region: 'us-east-1'});

// Create DynamoDB service object
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

/**
 * Tweet collection
 */
export const handler = () => {
  const T = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN, 
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  });

  T.get('search/tweets', {
    q: '(adocao OR adotar OR adote) AND (gato OR cachorro OR gata OR cachorra OR cadela OR filhote OR gatinho OR cachorrinho) -crianca -adolescente -roupa filter:media -filter:retweets',
    count: 100,
    lang: 'pt',
    result_type: 'recent',
    tweet_mode: 'extended',
  }, function(err, data, response) {
    if (data.statuses) {
      console.info(`Results found: ${data.statuses.length}`);

      const tweets = [];

      data.statuses.forEach(function(status) {
        const item = {
          PutRequest: {
            Item: {
              id: { S: status.id_str },
              full_text: { S: status.full_text },
              created_at: { S: moment(status.created_at, 'dd MMM DD HH:mm:ss ZZ YYYY', 'en').format() },
              user_id: { S: status.user.id_str },
              user_name: { S: status.user.name },
              user_screen_name: { S: status.user.screen_name },
              review_status: { S: ReviewStatus.NOT_REVIEWED },
            },
          },
        };

        tweets.push(item);
      });

      // DynamoDB limits batch write to 25 items
      for (let i = 0; i < tweets.length; i += 25) {
        const params = {
          RequestItems: {
            [process.env.DYNAMODB_TABLE]: tweets.slice(i, i + 25),
          },
        };

        dynamodb.batchWriteItem(params, function(err, data) {
          if (err) {
            console.error(err, err.stack);
          } else {
            console.info('DynamoDB write was successful', data);
          }
        });
      }
    } else if (err) {
      console.error(err);
    }
  });
};
