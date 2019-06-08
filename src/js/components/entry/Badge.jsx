import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';

const Badge = (props) => {
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

export default Badge;
