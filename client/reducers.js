import {
  IS_FETCHING_TWEETS_TO_REVIEW,
  LOAD_TWEETS_TO_REVIEW,
  REVIEW_TWEET,
} from './actions';

export const tweetsToReviewInitialState = {
  count: 0,
  error: false,
  isFetching: true,
  tweets: [],
};

export const tweetsToReviewReducer = (state = tweetsToReviewInitialState, action) => {
  switch (action.type) {
    case IS_FETCHING_TWEETS_TO_REVIEW:
      return {
        ...state,
        isFetching: true,
      };
    case LOAD_TWEETS_TO_REVIEW:
      return {
        ...state,
        count: !action.payload.error ? state.count + action.payload.count + 1 : state.count,
        error: action.payload.error,
        isFetching: false,
        lastEvaluatedKey: !action.payload.error ? action.payload.lastEvaluatedKey : state.lastEvaluatedKey,
        tweets: !action.payload.error ? state.tweets.concat(action.payload.tweets) : state.tweets,
      };
    case REVIEW_TWEET:
      return {
        ...state,
        count: !action.payload.error ? state.count - 1 : state.count,
        tweets: !action.payload.error ? state.tweets.filter((status) => status.id_str !== action.payload.id) : state.tweets,
      };
    default:
      return state;
  }
}
