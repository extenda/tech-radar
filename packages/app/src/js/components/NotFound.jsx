import React from 'react';

import radarService from '../modules/radarService';
import Navigation from './Navigation';

const NotFound = () => {
  const radar = radarService.model;

  return (
    <>
      <Navigation home={radar.quadrants} />
      <div className="container">
        <div className="row">
          <div className="container">
            <h1>Not Found</h1>
            <p>
              The requested resource was not found. You might have mistyped
              something or found a broken link.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;
