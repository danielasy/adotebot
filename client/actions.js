import axios from 'axios';

const apiURL = 'https://wzp9pph4s8.execute-api.us-east-1.amazonaws.com/dev';

/**
 * Tweets to review
 */
export const IS_FETCHING_TWEETS_TO_REVIEW = 'IS_FETCHING_TWEETS_TO_REVIEW';

export const isFetchingTweetsToReview = () => ({
  type: IS_FETCHING_TWEETS_TO_REVIEW,
});

export const LOAD_TWEETS_TO_REVIEW = 'LOAD_TWEETS_TO_REVIEW';

export const loadTweetsToReview = (payload, error) => ({
  type: LOAD_TWEETS_TO_REVIEW,
  payload,
  error: error || false,
});

export const REVIEW_TWEET = 'REVIEW_TWEET';

export const reviewTweet = (id, status, error) => ({
  type: REVIEW_TWEET,
  payload: { id, status },
  error: error || false,
});

export const fetchTweetsToReview = (lastEvaluatedKey) => (dispatch) => {
  dispatch(isFetchingTweetsToReview());

  const encodedKey = lastEvaluatedKey ? encodeURIComponent(JSON.stringify(lastEvaluatedKey)) : '';
  const endpoint = lastEvaluatedKey ?
    `/tweets?review_status=NOT_REVIEWED&last_evaluated_key=${encodedKey}` :
    '/tweets?review_status=NOT_REVIEWED';

  return axios
    .get(`${apiURL}${endpoint}`)
    .then((response) => {
      dispatch(loadTweetsToReview({
        count: response.data.count,
        lastEvaluatedKey: response.data.lastEvaluatedKey,
        tweets: response.data.data,
      }));
    })
    .catch((error) => {
      dispatch(loadTweetsToReview(error, true));
    });
}

export const updateReviewStatus = (id, status) => (dispatch) => {
  return axios
    .put(`${apiURL}/tweets/${id}`, status)
    .then((response) => {
      dispatch(reviewTweet(id, status));
    })
    .catch((error) => {
      // TODO
      console.error(error);
    });
}
