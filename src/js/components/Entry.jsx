import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import radarService from '../modules/radarService';
import Icon from './Icon';

export const Related = (props) => {
  const { related } = props;
  if (related.length === 0) {
    return null;
  }
  return (
    <React.Fragment>
      <h2>Related</h2>
      <ul>
        {related.map(value => (
          <li key={value.file}>
            <Link to={value.file}>{value.name}</Link>
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
};
Related.propTypes = {
  related: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    file: PropTypes.string.isRequired,
  })),
};
Related.defaultProps = {
  related: [],
};

export const History = (props) => {
  const { history } = props;
  if (history.length === 0) {
    return null;
  }
  return (
    <React.Fragment>
      <h2>History</h2>
      <ul className="history">
        {history.map(value => (
          <li key={value.date}>
            <Icon name="calendar" spaceBefore={false} />
            {value.date}
            &nbsp;-&nbsp;
            {value.ringName}
          </li>
        ))}
      </ul>
    </React.Fragment>
  );
};
History.propTypes = {
  history: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired,
    ringName: PropTypes.string.isRequired,
  })),
};
History.defaultProps = {
  history: [],
};

export const Badge = (props) => {
  const { className, icon, text } = props;
  return (
    <span className={`badge ${className}`}>
      <Icon name={icon} spaceBefore={false} />
      {text}
    </span>
  );
};
Badge.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};
Badge.defaultProps = {
  className: '',
};


const Entry = (props) => {
  const { match } = props;
  const entry = radarService.getEntry(match.params.id);

  return (
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
          {entry.active === false && (
            <Badge className="inactive" icon="warning" text="Inactive" />
          )}
        </div>
        <div className="twelve.columns">
          <Markdown source={entry.description} />
        </div>
        {entry.rationale && (
          <React.Fragment>
            <h2>Rationale</h2>
            <Markdown source={entry.rationale} />
          </React.Fragment>
        )}
        <Related related={entry.related} />
        <History history={entry.blip.history} />
      </div>
    </div>
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
