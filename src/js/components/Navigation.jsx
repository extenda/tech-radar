import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Icon from './Icon';

const Navigation = (props) => {
  const {
    quadrant,
    entry,
    home,
    tag,
  } = props;

  if (quadrant || entry || tag) {
    return (
      <nav className="navbar" role="navigation">
        <ul className="breadcrumb">
          <li key="home">
            <Link to="/">Tech Radar</Link>
            <Icon name="angle-right" />
          </li>
          {!entry && !tag && (
            <li key={quadrant.dirname}>
              {quadrant.name}
            </li>
          )}
          {entry && (
            <React.Fragment>
              <li key={quadrant.dirname}>
                <Link to={`/${quadrant.dirname}.html`}>{quadrant.name}</Link>
                <Icon name="angle-right" />
              </li>
              <li key={entry.name}>
                {entry.name}
              </li>
            </React.Fragment>
          )}
          {tag && (
            <li key={tag}>
              {tag}
            </li>
          )}
        </ul>
      </nav>
    );
  }

  return (
    <nav className="navbar" role="navigation">
      <ul className="quadrants">
        <li className="radar-root">
          <Link to="/">Tech Radar</Link>
          <Icon name="rss" />
        </li>
        {home.map(q => (
          <li key={q.dirname}>
            <Link to={`/${q.dirname}.html`}>{q.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const quadrantShape = {
  dirname: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

Navigation.propTypes = {
  quadrant: PropTypes.shape(quadrantShape),
  entry: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  tag: PropTypes.string,
  home: PropTypes.arrayOf(
    PropTypes.shape(quadrantShape),
  ),
};

Navigation.defaultProps = {
  quadrant: null,
  entry: null,
  tag: null,
  home: null,
};

export default Navigation;
