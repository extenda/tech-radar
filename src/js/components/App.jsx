import React, { Component } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';
import { withLDConsumer, camelCaseKeys } from 'launchdarkly-react-client-sdk';
import shajs from 'sha.js';
import PropTypes from 'prop-types';
import Login from './Login';
import Logout from './Logout';
import LDRadar from './Radar';
import Entry from './Entry';
import Quadrant from './Quadrant';
import Footer from './Footer';
import NotFound from './NotFound';
import TagList from './TagList';
import radarService from '../modules/radarService';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: false,
      loading: true,
    };
  }

  radarDidLoad = () => {
    this.setState((prevState) => ({
      ...prevState,
      loading: false,
    }));
  };

  radarDidFail = (err) => {
    // eslint-disable-next-line no-console
    console.error('Failed to load radar entries', err);
    this.setState((prevState) => ({
      ...prevState,
      isSignedIn: false,
      loading: true,
    }));
  };

  loginDidSucceed = (response) => {
    this.setState((prevState) => ({
      ...prevState,
      isSignedIn: true,
    }));

    const { ldClient } = this.props;
    if (!ldClient) {
      console.debug('Missing LDClient property');
      return null;
    }

    const { tokenId, profileObj: { googleId, email }} = response;
    return ldClient.identify({
      key: shajs('sha256').update(`${googleId}`).digest('hex'),
      email,
      privateAttributeNames: ['email'],
    }).then(camelCaseKeys)
      .then((flags) => radarService.init(tokenId, flags.enableToolRadar)
        .then(this.radarDidLoad)
        .catch(this.radarDidFail));
  };

  loginDidFail = () => {};

  render = () => {
    const { loading, isSignedIn } = this.state;

    if (!isSignedIn) {
      return (
        <Login
          onSuccess={this.loginDidSucceed}
          onFailure={this.loginDidFail}
        />
      );
    }

    if (loading) {
      return null;
    }

    return (
      <>
        <Logout />
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={LDRadar} />
            <Route path="/entries/:id" component={Entry} />
            <Route path="/:quadrant.html" component={Quadrant} />
            <Route path="/tags/:tag.html" component={TagList} />
            <Route path="*" component={NotFound} />
          </Switch>
        </BrowserRouter>
        <Footer />
      </>
    );
  };
}

App.propTypes = {
  ldClient: PropTypes.shape({
    identify: PropTypes.func.isRequired,
  }),
};
App.defaultProps = {
  ldClient: null,
};

export default withLDConsumer({ clientOnly: true })(App);
