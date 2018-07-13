import axios from 'axios';
import { CircularProgress } from 'material-ui/Progress';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { fetchTweetsToReview, updateReviewStatus } from '../actions';
import TweetList from './TweetList';

const styles = (theme) => ({
  container: {
    width: '100%',
    maxWidth: 680,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '36px auto',
  },
  progress: {
    margin: '0 auto 36px auto',
  },
});

class ReviewTab extends React.Component {
  componentDidMount() {
    this.props.fetchTweets();
  }

  render() {
    const {
      classes,
      fetchTweets,
      isFetching,
      lastEvaluatedKey,
      reviewTweet,
      tweets,
    } = this.props;
    return (
      <div className={classes.container}>
        {
          isFetching && <CircularProgress className={classes.progress} />
        }
        {
          tweets.length > 0 &&
          <TweetList
            isFetching={isFetching}
            fetchTweets={fetchTweets}
            lastEvaluatedKey={lastEvaluatedKey}
            reviewTweet={reviewTweet}
            tweets={tweets}
          />
        }
        {
          !isFetching && tweets.length === 0 &&
          <p>Não há tweets para mostrar :(</p>
        }
      </div>
    );
  }
}

ReviewTab.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchTweets: PropTypes.func.isRequired,
  isFetching: PropTypes.bool.isRequired,
  lastEvaluatedKey: PropTypes.object,
  reviewTweet: PropTypes.func.isRequired,
  tweets: PropTypes.array.isRequired,
};

const mapStateToProps = ({ tweetsToReview }) => ({
  ...tweetsToReview,
});

const mapDispatchToProps = (dispatch) => ({
  fetchTweets: (lastEvaluatedKey) => dispatch(fetchTweetsToReview(lastEvaluatedKey)),
  reviewTweet: (id, status) => dispatch(updateReviewStatus(id, status)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(ReviewTab));
