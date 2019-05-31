import React from 'react';
import radarService from '../modules/radarService';
import Icon from './Icon';

const Dot = () => (
  <React.Fragment>
    {' '}
    &#8729;
    {' '}
  </React.Fragment>
);

const Footer = () => {
  const { title, version, formattedDate } = radarService.model;
  return (
    <footer className="footer">
      <div className="container">
        <p className="footer-text">
          {title}
          {' '}
          {version}
          {', '}
          {formattedDate}
          <Dot />
          <Icon name="copyright" spaceBefore={false} />
          <a href="https://extendaretail.com">Extenda Retail</a>
          <br />
          Maintained at
          <Icon name="github" />
          <a href="https://github.com/extenda/tech-radar">GitHub</a>
          <Dot />
          Discuss in
          <Icon name="slack" />
          <a href="https://extendaretail.slack.com/channels/tech-radar">tech-radar</a>
          <br />
          The Tech Radar Generator is licensed under
          {' '}
          <a href="https://github.com/extenda/tech-radar/blob/master/LICENSE">MIT</a>
          <Dot />
          Thanks to Zalando for the
          {' '}
          <a href="https://github.com/zalando/tech-radar">radar visualization</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
