import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'react-markdown';
import Icon from '../Icon';

const OS_LICENSES = {
  'Apache-1.1': 'Apache Software License Version 1.1',
  'Apache-2.0': 'Apache Software License Version 2.0',
  'BSD-2': 'Simplified BSD License (BSD 2-Clause License)',
  'BSD-3': 'New BSD License (BSD 3-Clause License)',
  'BSD-4': 'Original BSD License (BSD 4-Clause License)',
  'BSD-style': 'BSD-style license, see project license for details',
  CC0: 'Creative Commons Public Domain',
  'CDDL-1.0': 'Common Development and Distribution License (CDDL) Version 1.0',
  'CCDL-1.1': 'Common Development and Distribution License (CDDL) Version 1.1',
  'EPL-1.0': 'Eclipse Public License (EPL) Version 1.0',
  'EDL-1.0': 'Eclipse Distribution License (EDL) Version 1.0',
  'LGPL-2.1': 'GNU Lesser General Public License (LGPL) Version 2.1',
  'LGPL-3.0': 'GNU Lesser General Public License (LGPL) Version 3.0',
  'GPL-CE': 'GNU General Public License (GPL) with the Classpath Exception',
  MIT: 'The MIT License',
  'MPL-1.0': 'Mozilla Public License (MPL) Version 1.0',
  'MPL-1.1': 'Mozilla Public License (MPL) Version 1.1',
  'MPL-2.0': 'Mozilla Public License (MPL) Version 2.0',
  Public: 'Public Domain',
};

const COMMERCIAL_DEFAULT_TEXT = {
  Google: 'Use of this software requires a license for Google Cloud Platform.',
};

const commercialDescription = commercial => commercial.description
  || COMMERCIAL_DEFAULT_TEXT[commercial.company];

const License = (props) => {
  const { license: { openSource, commercial } } = props;

  if (openSource == null && commercial == null) {
    return null;
  }

  return (
    <React.Fragment>
      <h2>
        License
      </h2>
      {openSource && (
        <div>
          <strong>
            <Icon name="check" />
            Available for use under an open-source license.
          </strong>
          <p>
            {openSource.link
              ? <a href={openSource.link}>{OS_LICENSES[openSource.name]}</a>
              : OS_LICENSES[openSource.name]}
          </p>
          {openSource.description && (
            <Markdown source={openSource.description} />
          )}
        </div>
      )}
      {commercial && (
        <div>
          <strong>
            <Icon name="exclamation-triangle" />
            Available for use with a commercial agreement from
            {' '}
            {commercial.company}
            .
          </strong>
          {commercialDescription(commercial) && (
            <Markdown source={commercialDescription(commercial)} />
          )}
        </div>
      )}
    </React.Fragment>
  );
};

License.propTypes = {
  license: PropTypes.shape({
    openSource: PropTypes.shape({
      name: PropTypes.string.isRequired,
      link: PropTypes.string,
      description: PropTypes.string,
    }),
    commercial: PropTypes.shape({
      company: PropTypes.string.isRequired,
      description: PropTypes.string,
    }),
  }),
};

License.defaultProps = {
  license: {
    openSource: null,
    commercial: null,
  },
};

export default License;
