import React, { Component } from 'react';
import {
  BrowserRouter,
  NavLink,
  Switch,
  Route,
} from 'react-router-dom';
import Radar from './Radar';
import Entry from './Entry';
import Quadrant from './Quadrant';
import Footer from './Footer';
import radarService from '../modules/radarService';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount = () => {
    radarService.init()
      .then(() => this.setState({
        loading: false,
      }));
  };

  render = () => {
    const { loading } = this.state;

    if (loading) {
      return null;
    }

    const radar = radarService.model;

    return (
      <React.Fragment>
        <BrowserRouter>
          <React.Fragment>
            <nav className="navbar" role="navigation">
              <ul className="quadrants">
                <li className="radar-root">
                  <NavLink to="/">Tech Radar</NavLink>
                  <i className="fa fa-rss" />
                </li>
                {radar.quadrantsNavBar.map(quadrant => (
                  <li key={quadrant.dirname}>
                    <NavLink to={`/${quadrant.dirname}.html`}>{quadrant.name}</NavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <Switch>
              <Route exact path="/" component={Radar} />
              <Route path="/entries/:id" component={Entry} />
              <Route path="/:quadrant.html" component={Quadrant} />
            </Switch>
          </React.Fragment>
        </BrowserRouter>
        <Footer />
      </React.Fragment>
    );
  };
}
