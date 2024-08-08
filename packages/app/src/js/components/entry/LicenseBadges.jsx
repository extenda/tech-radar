import React from 'react';

import Badge from './Badge';
import License from './License';

const LicenseBadges = (props) => {
  const {
    license: { openSource, commercial },
  } = props;

  return (
    <>
      {openSource && (
        <Badge
          icon="balance-scale"
          className="license"
          text={openSource.name}
          link={openSource.link}
        />
      )}
      {commercial && <Badge icon="balance-scale" className="license" text="Commercial" />}
    </>
  );
};

LicenseBadges.propTypes = {
  ...License.propTypes,
};

LicenseBadges.defaultProps = {
  ...License.defaultProps,
};

export default LicenseBadges;
