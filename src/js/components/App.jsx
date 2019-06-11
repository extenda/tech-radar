import React, { Component } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';
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
      loading: true,
    };
  }

  radarDidLoad = () => {
    this.setState({
      loading: false,
    });
  };

  componentDidMount = () => radarService.init().then(this.radarDidLoad);

  render = () => {
    const { loading } = this.state;

    if (loading) {
      return null;
    }

    return (
      <React.Fragment>
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
