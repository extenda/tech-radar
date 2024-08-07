import React from 'react';
import Navigation from './Navigation';
import radarService from '../modules/radarService';

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
