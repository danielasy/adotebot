import Button from 'material-ui/Button';
import { CircularProgress } from 'material-ui/Progress';
import List, { ListItem } from 'material-ui/List';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import PropTypes from 'prop-types';
import React from 'react';

import TweetListItem from './TweetListItem';

const styles = (theme) => ({
  container: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  progress: {
    margin: 'auto',
  },
});

class TweetList extends React.Component {
  fetchMoreTweets = () => this.props.fetchTweets(this.props.lastEvaluatedKey);

  render() {
    const { classes, isFetching, lastEvaluatedKey, reviewTweet, tweets } = this.props;
    return (
      <div className={classes.container}>
        <List>
          {tweets.map((status) => (
            <TweetListItem
              key={status.id_str}
              reviewTweet={reviewTweet}
              status={status}
            />
          ))}
          <ListItem>
            <Typography align="center" style={{ width: '100%' }} variant="body1">
              {
                isFetching && <CircularProgress className={classes.progress} />
              }
              {
                !isFetching && (lastEvaluatedKey !== undefined ?
                <Button onClick={this.fetchMoreTweets}>Ver mais</Button> :
                <span>Fim</span>)
              }
            </Typography>
          </ListItem>
        </List>
      </div>
    );
  }
}

TweetList.propTypes = {
  classes: PropTypes.object.isRequired,
  isFetching: PropTypes.bool.isRequired,
  fetchTweets: PropTypes.func.isRequired,
  lastEvaluatedKey: PropTypes.object,
  reviewTweet: PropTypes.func.isRequired,
  tweets: PropTypes.array.isRequired,
};

export default withStyles(styles)(TweetList);
