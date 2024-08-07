import PropTypes from 'prop-types';
import React from 'react';
import Markdown from 'react-markdown';

import radarService from '../modules/radarService';
import Badge from './entry/Badge';
import History from './entry/History';
import License from './entry/License';
import LicenseBadges from './entry/LicenseBadges';
import Related from './entry/Related';
import Tags from './entry/Tags';
import Icon from './Icon';
import Navigation from './Navigation';
import NotFound from './NotFound';

const Entry = (props) => {
  const { match } = props;
  const entry = radarService.getEntry(match.params.id);
  if (!entry) {
    return <NotFound />;
  }
  const quadrant = radarService.model.quadrants.find((q) => q.dirname === entry.quadrant.dirname);

  return (
    <>
      <Navigation quadrant={quadrant} entry={{ name: entry.name }} />
      <div className="container">
        {entry.blip.active === false && (
          <div className="row">
            <div className="twelve columns inactive-note">
              <strong>
                <Icon name="exclamation-triangle" />
                Not active on the current version!
              </strong>
              <br />
              This blip is not on the current version of the radar. If it was recently archived it
              is likely that it is still relevant. If the blip is older it might no longer be
              relevant or our assessment of it might be different today.
            </div>
          </div>
        )}
        <div className="row">
          <div className="entry-container">
            <h1>{entry.name}</h1>
            {entry.logo && <img src={entry.logo} alt={entry.name} className="entry-logo" />}
          </div>
        </div>
        <div className="row">
          <div className="badges">
            <Badge className={entry.blip.ringName} icon="map-marker" text={entry.blip.ringName} />
            <Badge icon="clock-o" text={entry.blip.since} />
            <LicenseBadges license={entry.license} />
          </div>
          <div className="twelve columns">
            <Markdown>{entry.description}</Markdown>
            {entry.rationale && (
              <>
                <h2>Rationale</h2>
                <Markdown>{entry.rationale}</Markdown>
              </>
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
    </>
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
