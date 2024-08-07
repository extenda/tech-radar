import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon';

const History = (props) => {
  const { history } = props;

  if (history.length === 0) {
    return null;
  }

  return (
    <>
      <h2>History</h2>
      <ul className="history">
        {history.map((value) => (
          <li key={value.date}>
            <Icon name="calendar" spaceBefore={false} />
            {value.date}
            &nbsp;-&nbsp;
            {value.ringName}
          </li>
        ))}
      </ul>
    </>
  );
};

History.propTypes = {
  history: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string.isRequired,
    ringName: PropTypes.string.isRequired,
  })),
};

History.defaultProps = {
  history: [],
};

export default History;
