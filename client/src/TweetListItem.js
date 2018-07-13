import Avatar from 'material-ui/Avatar';
import GridList, { GridListTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import { ListItem, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckIcon from '@material-ui/icons/Check';

const styles = (theme) => ({
  itemRoot: {
    alignItems: 'flex-start',
  },
  action: {
    marginTop: 12,
  },
});

class TweetListItem extends React.Component {
  approveTweet = () => {
    this.props.reviewTweet(this.props.status.id_str, 'APPROVED');
  }

  rejectTweet = () => {
    this.props.reviewTweet(this.props.status.id_str, 'REJECTED');
  }

  render() {
    const { classes, status } = this.props;
    return (
      <ListItem
        classes={{ root: classes.itemRoot }}
        divider={true}
      >
        <Avatar src={status.user.profile_image_url_https} alt={status.user.name} />
        <ListItemText>
          <React.Fragment>
            <Typography variant="body2">
              {status.user.name} @{status.user.screen_name}
            </Typography>
            <Typography paragraph={true} variant="body1">
              {status.full_text}
            </Typography>
            {
              (status.extended_entities && status.extended_entities.media) &&
              <GridList cellHeight={160} cols={2}>
                {status.extended_entities.media.map((media, index) => (
                  <GridListTile
                    key={media.id}
                    cols={
                      (status.extended_entities.media.length === index + 1)
                      && index % 2 === 0 ? 2 : 1
                    }
                  >
                    <img src={media.media_url_https} />
                  </GridListTile>
                ))}
              </GridList>
            }
            <IconButton
              color="primary"
              className={classes.action}
              onClick={this.approveTweet}
              aria-label="Approve"
            >
              <CheckIcon />
            </IconButton>
            <IconButton
              color="secondary"
              className={classes.action}
              onClick={this.rejectTweet}
              aria-label="Reject"
            >
              <CancelIcon />
            </IconButton>
          </React.Fragment>
        </ListItemText>
      </ListItem>
    );
  }
}

TweetListItem.propTypes = {
  classes: PropTypes.object.isRequired,
  reviewTweet: PropTypes.func.isRequired,
  status: PropTypes.object.isRequired,
};

export default withStyles(styles)(TweetListItem);
