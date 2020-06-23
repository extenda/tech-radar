import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import SvgRadar from '../lib/radar';
import radarService from '../modules/radarService';
import Icon from './Icon';
import Navigation from './Navigation';
import TagsInput from './TagsInput';
import { pick } from '../modules/utils';
import QuadrantList from './QuadrantList';

export default class Radar extends Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);

    this.svgRadar = this.createSvgRadar();

    this.state = {
      blips: radarService.listBlips([]),
    };
  }

  createSvgRadar = () => {
    const { history } = this.props;

    const radar = radarService.model;

    return new SvgRadar({
      svg_id: 'radar',
      width: 900, // 1450 Set to 900 if not printing labels.
      height: 900,
      colors: {
        background: '#fff',
        grid: '#bbb',
        inactive: '#ddd',
      },
      title: `${radar.title} - ${radar.version}`,
      quadrants: radar.quadrants.map(q => pick(q, 'name')),
      rings: [
        { name: 'Adopt', color: '#43a047' },
        { name: 'Trial', color: '#c0ca33' },
        { name: 'Assess', color: '#ffb300' },
        { name: 'Hold', color: '#bf360c' },
      ],
      print_layout: true,
      print_entities: false,
      print_footer: true,
      linkOnClick: (link) => {
        history.push(link);
      },
    });
  };

  renderRadar = () => {
    this.svgRadar.renderBackground();
    this.renderBlips();
  };

  renderBlips = () => {
    const { blips } = this.state;
    this.svgRadar.renderEntries(blips);
  };

  onFilter = (tags) => {
    this.setState({
      blips: radarService.listBlips(tags.map(t => t.name)),
    }, this.renderBlips);
  };

  componentDidMount = () => {
    this.renderRadar();
  };

  onMouseEnter = (e) => {
    const id = e.currentTarget.getAttribute('data-radar-id');
    this.svgRadar.showBubbleForId(id);
    this.svgRadar.highlightLegendItem({ id });
  };

  onMouseLeave = (e) => {
    const id = e.currentTarget.getAttribute('data-radar-id');
    this.svgRadar.hideBubble();
    this.svgRadar.unhighlightLegendItem({ id });
  };

  renderQuadrant = (quadrant) => {
    const { blips } = this.state;
    const entries = radarService.getQuadrant(quadrant.dirname, true);

    return (
      <>
        <h2>{quadrant.name}</h2>
        <QuadrantList
          quadrant={entries}
          blips={blips}
          headerLevel={3}
          useShortname
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        />
      </>
    );
  }

  render = () => {
    const radar = radarService.model;

    return (
      <React.Fragment>
        <Navigation home={radar.quadrantsNavBar} />
        <h1 className="center">
          {radar.title}
          &nbsp;
          <span className="version">
            <Icon name="tag" />
            {radar.version}
          </span>
        </h1>
        <div className="tags-filter">
          <TagsInput onFilter={this.onFilter} tags={radarService.listTags()} />
        </div>
        <div className="radar-container u-full-width">
          <div className="radar-entries">
            {this.renderQuadrant(radar.quadrants[2])}
            {this.renderQuadrant(radar.quadrants[1])}
          </div>
          <div className="svg-radar">
            <svg id="radar" />
          </div>
          <div className="radar-entries">
            {this.renderQuadrant(radar.quadrants[3])}
            {this.renderQuadrant(radar.quadrants[0])}
          </div>
        </div>
        <div className="u-cf" />
        <div className="container">
          <div className="row">
            <div className="one-half column">
              <h2>About the Tech Radar</h2>
              <p>
                The Extenda Retail Tech Radar is based on the concept introduced by
                {' '}
                <a href="https://www.thoughtworks.com/radar">ThoughtWorks</a>
                .
                The Radar contains a list of technologies, complemented by an assessment result,
                called ring assessment.
                The following rings are used:
              </p>
              <ul className="no-bullets">
                <li>
                  <strong>Adopt</strong>
                  {' — '}
                  Technologies we have high confidence in and recommend for wide use.
                </li>
                <li>
                  <strong>Trial</strong>
                  {' — '}
                  Technologies we have seen used with success, but are yet to be proved successfully
                  in wide use and at large scale. Carries higher risk.
                </li>
                <li>
                  <strong>Assess</strong>
                  {' — '}
                  Technologies that are promising with a clear potential value for us.
                  Requires research and prototyping to analyze its impact.
                </li>
                <li>
                  <strong>Hold</strong>
                  {' — '}
                  Technologies not recommended for new products or technology we no longer
                  want to invest in. Existing products may still consider these depending
                  on their legacy.
                </li>
              </ul>
            </div>
            <div className="one-half column">
              <h2>The Purpose</h2>
              <p>
                The Tech Radar aims to inspire and support teams at Extenda Retail to pick the
                best technologies for their projects. It is way to share experience and knowledge
                between the teams and to create transparency about the technology direction of
                Extenda Retail.
                The Tech Radar also becomes a list of dos and don&apos;ts, what to try and to avoid
                in order to increase success.
              </p>
              <h2>How to Contribute</h2>
              <p>
                The Tech Radar is maintained on
                {' '}
                <a href="https://github.com/extenda/tech-radar">GitHub</a>
                .
                There you can read more about the process and how to contribute.
              </p>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  };
}
