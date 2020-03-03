import React, { Component } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';
import Login from './Login';
import Logout from './Logout';
import Radar from './Radar';
import Entry from './Entry';
import Quadrant from './Quadrant';
import Footer from './Footer';
import NotFound from './NotFound';
import TagList from './TagList';
import radarService from '../modules/radarService';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: false,
      loading: true,
    };
  }

  radarDidLoad = () => {
    this.setState(prevState => ({
      ...prevState,
      loading: false,
    }));
  };

  radarDidFail = (err) => {
    // eslint-disable-next-line no-console
    console.error('Failed to load radar entries', err);
    this.setState(prevState => ({
      ...prevState,
      isSignedIn: false,
      loading: true,
    }));
  };

  loginDidSucceed = (response) => {
    this.setState(prevState => ({
      ...prevState,
      isSignedIn: true,
    }));

    const { tokenId } = response;
    radarService.init(tokenId)
      .then(this.radarDidLoad)
      .catch(this.radarDidFail);
  };

  loginDidFail = () => {};

  render = () => {
    const { loading, isSignedIn } = this.state;

    if (!isSignedIn) {
      // For local development, we disable authentication.
      if (process.env.NODE_ENV === 'development') {
        this.loginDidSucceed({ accessToken: 'test' });
        return null;
      }
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
      <React.Fragment>
        <Logout />
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Radar} />
            <Route path="/entries/:id" component={Entry} />
            <Route path="/:quadrant.html" component={Quadrant} />
            <Route path="/tags/:tag.html" component={TagList} />
            <Route path="*" component={NotFound} />
          </Switch>
        </BrowserRouter>
        <Footer />
      </React.Fragment>
    );
  };
}
