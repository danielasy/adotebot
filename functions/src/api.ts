import {
  APIGatewayProxyEvent,
  APIGatewayEventRequestContext,
  Callback,
} from 'aws-lambda';

import { getTweetsWithReviewStatus } from './getHydratedTweets';
import { updateReviewStatus } from './updateTweets';

/**
 * Handler
 */
export const handler = (event: APIGatewayProxyEvent, context: APIGatewayEventRequestContext, callback: Callback<any>) => {
  const done = (err?: any, res?: any) => callback(null, {
    statusCode: err ? '400' : '200',
    body: err ? err.message : JSON.stringify(res),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  });

  switch (event.httpMethod) {
    case 'GET':
      if (!event.queryStringParameters || !event.queryStringParameters.review_status) {
        done(new Error(`Missing required query parameter "review_status"`));
      }
      getTweetsWithReviewStatus(
        event.queryStringParameters.review_status,
        event.queryStringParameters.last_evaluated_key ? JSON.parse(decodeURIComponent(event.queryStringParameters.last_evaluated_key)) : undefined,
        done,
      );
      break;
    case 'PUT':
      if (!event.pathParameters || !event.pathParameters.id) {
        done(new Error(`Missing required path parameter "id"`));
      }
      updateReviewStatus(
        event.pathParameters.id,
        event.body,
        done,
      );
      break;
    default:
      done(new Error(`Unsupported method ${event.httpMethod}`));
  }
};
