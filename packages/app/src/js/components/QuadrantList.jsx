import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const header = (title, level) => {
  switch (level) {
    case 3:
      return (<h3>{title}</h3>);
    default:
      return (<h2>{title}</h2>);
  }
};

const renderEntry = (entry, enabled, params) => {
  const {
    useShortname,
    onMouseEnter,
    onMouseLeave,
  } = params;

  const name = useShortname ? (entry.shortname || entry.name) : entry.name;

  if (!enabled) {
    return name;
  }

  return (
    <Link
      to={`/entries/${entry.filename}`}
      className={entry.active ? '' : 'inactive'}
      data-radar-id={entry.id}
      onMouseEnter={enabled ? onMouseEnter : undefined}
      onMouseLeave={enabled ? onMouseLeave : undefined}
    >
      {name}
    </Link>
  );
};

const renderEntriesList = (params, ring) => {
  const { filter, quadrant } = params;
  const isEnabled = (entry) => filter.has(-1) || filter.has(entry.id);

  return (
    <ol className={ring}>
      {quadrant[ring].map((entry) => (
        <li
          value={entry.id}
          key={entry.filename}
          id={`legendItem${entry.id}`}
          className={isEnabled(entry) ? '' : 'filter-hidden'}
        >
          {renderEntry(entry, isEnabled(entry), params)}
        </li>
      ))}
    </ol>
  );
};

const QuadrantList = (props) => {
  const {
    blips,
    quadrant,
    headerLevel,
    useShortname,
    onMouseEnter,
    onMouseLeave,
  } = props;

  const params = {
    filter: new Set(blips.map((b) => b.id)),
    quadrant,
    useShortname,
    onMouseEnter,
    onMouseLeave,
  };

  return (
    <>
      <div className="row">
        <div className="one-half column">
          {header('Adopt', headerLevel)}
          {renderEntriesList(params, 'adopt')}

          {header('Trial', headerLevel)}
          {renderEntriesList(params, 'trial')}
        </div>
        <div className="one-half column">
          {header('Assess', headerLevel)}
          {renderEntriesList(params, 'assess')}

          {header('Hold', headerLevel)}
          {renderEntriesList(params, 'hold')}
        </div>
      </div>
    </>
  );
};

const entries = PropTypes.arrayOf(PropTypes.shape({
  name: PropTypes.string.isRequired,
  shortname: PropTypes.string,
  filename: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  id: PropTypes.number.isRequired,
})).isRequired;

QuadrantList.propTypes = {
  blips: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
  })),
  quadrant: PropTypes.shape({
    adopt: entries,
    trial: entries,
    assess: entries,
    hold: entries,
  }).isRequired,
  headerLevel: PropTypes.number,
  useShortname: PropTypes.bool,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

QuadrantList.defaultProps = {
  blips: [{ id: -1 }],
  headerLevel: 2,
  useShortname: false,
  onMouseEnter: undefined,
  onMouseLeave: undefined,
};

export default QuadrantList;
