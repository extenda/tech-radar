import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import radarService from '../modules/radarService';

export default class Quadrant extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        quadrant: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
  };

  renderEntriesList = (quadrant, ring) => (
    <ul className={ring}>
      { quadrant[ring].map(entry => (
        <li key={entry.filename}>
          <Link to={`/entries/${entry.filename}`}>{entry.name}</Link>
        </li>
      ))}
    </ul>
  );

  render = () => {
    const { match } = this.props;
    const quadrant = radarService.getQuadrant(match.params.quadrant);
    return (
      <div className="container">
        <h1>{quadrant.name}</h1>
        <div className="row">
          <div className="one-half column">
            <h2>Adopt</h2>
            {this.renderEntriesList(quadrant, 'adopt')}

            <h2>Trial</h2>
            {this.renderEntriesList(quadrant, 'trial')}
          </div>
          <div className="one-half column">
            <h2>Assess</h2>
            {this.renderEntriesList(quadrant, 'assess')}

            <h2>Hold</h2>
            {this.renderEntriesList(quadrant, 'hold')}
          </div>
        </div>
      </div>
    );
  };
}
