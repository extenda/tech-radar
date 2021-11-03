import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Related = (props) => {
  const { related } = props;

  if (related.length === 0) {
    return null;
  }

  return (
    <>
      <h2>Related</h2>
      <ul>
        {related.map((value) => (
          <li key={value.file}>
            <Link to={value.file}>{value.name}</Link>
          </li>
        ))}
      </ul>
    </>
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

export default Related;
