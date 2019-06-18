import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Navigation from './Navigation';
import Icon from './Icon';
import radarService from '../modules/radarService';

const TagList = (props) => {
  const { match: { params: { tag } } } = props;

  const entries = radarService.listEntriesByTag(tag);

  return (
    <React.Fragment>
      <Navigation tag={tag} />
      <div className="container">
        <h1>
          <Icon name="tag" />
          {tag}
        </h1>
        <ul>
          {entries.map(entry => (
            <li key={entry.name}>
              <Link to={`/entries/${entry.filename}`}>{entry.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </React.Fragment>
  );
};

TagList.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      tag: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default TagList;
