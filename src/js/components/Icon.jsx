import React from 'react';
import PropTypes from 'prop-types';

const Icon = (props) => {
  const { name, spaceBefore } = props;

  return (
    <React.Fragment>
      {spaceBefore && (
        <React.Fragment>
          {' '}
        </React.Fragment>
      )}
      <i className={`fa fa-${name}`} />
      {' '}
    </React.Fragment>
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  spaceBefore: PropTypes.bool,
};

Icon.defaultProps = {
  spaceBefore: true,
};

export default Icon;
