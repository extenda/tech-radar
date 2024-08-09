import { jwtDecode } from 'jwt-decode';
import { withLDConsumer } from 'launchdarkly-react-client-sdk';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import radarService from '../modules/radarService';
import sha256 from '../modules/sha256';
import Entry from './Entry';
import Footer from './Footer';
import Login from './Login';
import Logout from './Logout';
import NotFound from './NotFound';
import Quadrant from './Quadrant';
import LDRadar from './Radar';
import TagList from './TagList';

export class App extends Component {
  constructor(props) {
    super(props);
    if (typeof DISABLE_GOOGLE_LOGIN === 'boolean' && DISABLE_GOOGLE_LOGIN) {
      // No log in required. Usually desired in development server.
      this.state = {
        isSignedIn: true,
        loading: true,
      };
      radarService.init().then(this.radarDidLoad);
    } else {
      this.state = {
        isSignedIn: false,
        loading: true,
      };
    }
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
      // eslint-disable-next-line no-console
      console.debug('Missing LDClient property');
      return null;
    }

    const { sub, email } = jwtDecode(response.credential);
    return sha256(sub).then((key) =>
      ldClient
        .identify({
          kind: 'user',
          key,
          email,
          _meta: {
            privateAttributeNames: ['email'],
          },
        })
        .then(() =>
          radarService.init(response.credential).then(this.radarDidLoad).catch(this.radarDidFail),
        ),
    );
  };

  loginDidFail = () => {};

  render = () => {
    const { loading, isSignedIn } = this.state;

    if (!isSignedIn) {
      return <Login onSuccess={this.loginDidSucceed} onFailure={this.loginDidFail} />;
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
