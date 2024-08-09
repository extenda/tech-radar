import PropTypes from 'prop-types';
import React from 'react';

import radarService from '../modules/radarService';
import Navigation from './Navigation';
import NotFound from './NotFound';
import QuadrantList from './QuadrantList';

const Quadrant = ({ match }) => {
  const quadrant = radarService.getQuadrant(match.params.quadrant);

  if (!quadrant) {
    return <NotFound />;
  }

  return (
    <>
      <Navigation quadrant={{ name: quadrant.name, dirname: quadrant.dirname }} />
      <div className="container">
        <h1>{quadrant.name}</h1>
        <QuadrantList quadrant={quadrant} />
      </div>
    </>
  );
};

Quadrant.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      quadrant: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Quadrant;
