import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Icon from './Icon';

const Navigation = (props) => {
  const { quadrant, entry, home } = props;

  if (quadrant || entry) {
    return (
      <nav className="navbar" role="navigation">
        <ul className="breadcrumb">
          <li>
            <Link to="/">Tech Radar</Link>
            <Icon name="angle-right" />
          </li>
          {!entry && (
            <li>
              {quadrant.name}
            </li>
          )}
          {entry && (
            <React.Fragment>
              <li>
                <Link to={`/${quadrant.dirname}.html`}>{quadrant.name}</Link>
                <Icon name="angle-right" />
              </li>
              <li>
                {entry.name}
              </li>
            </React.Fragment>
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
        {home && home.map(q => (
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
  home: PropTypes.arrayOf(
    PropTypes.shape(quadrantShape)),
};

Navigation.defaultProps = {
  quadrant: null,
  entry: null,
  home: null,
};

export default Navigation;
