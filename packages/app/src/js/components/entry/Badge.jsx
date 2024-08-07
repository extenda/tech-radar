import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';

const Badge = (props) => {
  const {
    className,
    icon,
    text,
    link,
  } = props;

  let content;

  if (link) {
    content = (
      <a href={link}>{text}</a>
    );
  } else {
    content = text;
  }

  return (
    <span className={`badge ${className}`}>
      <Icon name={icon} spaceBefore={false} />
      {content}
    </span>
  );
};

Badge.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  link: PropTypes.string,
};

Badge.defaultProps = {
  className: '',
  link: null,
};

export default Badge;
