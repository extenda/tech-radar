import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import radarService from '../modules/radarService';
import Related from './entry/Related';
import History from './entry/History';
import Badge from './entry/Badge';
import Tags from './entry/Tags';
import License from './entry/License';
import Navigation from './Navigation';
import NotFound from './NotFound';
import LicenseBadges from './entry/LicenseBadges';

const Entry = (props) => {
  const { match } = props;
  const entry = radarService.getEntry(match.params.id);
  if (!entry) {
    return (
      <NotFound />
    );
  }
  const quadrant = radarService.model.quadrants.find(q => q.dirname === entry.quadrant.dirname);

  return (
    <React.Fragment>
      <Navigation quadrant={quadrant} entry={{ name: entry.name }} />
      <div className="container">
        <div className="row">
          <div className="entry-container">
            <h1>{entry.name}</h1>
            {entry.logo && (
              <img src={entry.logo} alt={entry.name} className="entry-logo" />
            )}
          </div>
        </div>
        <div className="row">
          <div className="badges">
            <Badge className={entry.blip.ringName} icon="map-marker" text={entry.blip.ringName} />
            <Badge icon="clock-o" text={entry.blip.since} />
            {(entry.blip.active === false) && (
              <Badge className="inactive" icon="warning" text="Inactive" />
            )}
            <LicenseBadges license={entry.license} />
          </div>
          <div className="twelve columns">
            <Markdown source={entry.description} />
            {entry.rationale && (
              <React.Fragment>
                <h2>Rationale</h2>
                <Markdown source={entry.rationale} />
              </React.Fragment>
            )}
            <License license={entry.license} />
            <Related related={entry.related} />
            <History history={entry.blip.history} />
          </div>
        </div>
        <div className="u-pull-right">
          <Tags tags={entry.tags} />
        </div>
      </div>
    </React.Fragment>
  );
};

Entry.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Entry;
