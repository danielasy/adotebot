import AppBar from 'material-ui/AppBar';
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import withRedux from 'next-redux-wrapper';
import React from 'react';

import ReviewTab from '../src/ReviewTab';
import withRoot from '../src/withRoot';
import { initStore } from '../store';
import '../styles/reset.css';

class Index extends React.Component {
  state = {
    tab: 0,
  };

  handleChange = (event, tab) => {
    this.setState({ tab });
  };

  render() {
    return (
      <main>
        <AppBar color="primary" position="static">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Adotebot
            </Typography>
          </Toolbar>
        </AppBar>
        <Paper>
          <Tabs
            value={this.state.tab}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Aguardando revisão" />
          </Tabs>
        </Paper>
        <ReviewTab />
      </main>
    );
  }
}

export default withRedux(initStore, null, null)(withRoot(Index));
