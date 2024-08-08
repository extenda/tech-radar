import React from 'react';
import PropTypes from 'prop-types';

const Icon = (props) => {
  const { name, spaceBefore } = props;

  return (
    <>
      {spaceBefore && <> </>}
      <i className={`fa fa-${name}`} />{' '}
    </>
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
