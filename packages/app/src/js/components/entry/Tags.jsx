import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import Icon from '../Icon';

const Tags = (props) => {
  const { tags } = props;

  if (tags.length === 0) {
    return null;
  }

  return (
    <>
      <Icon name="tags" />
      {[...new Set(tags)].map((tag) => (
        <button key={tag} type="button" className="entry-tag">
          <Link to={`/tags/${tag}.html`}>{tag}</Link>
        </button>
      ))}
    </>
  );
};

Tags.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Tags;
