import React from 'react';
import { shallow } from 'enzyme';
import Entry from '../js/components/Entry';

const mockEntries = {
  java: {
    name: 'Java',
    blip: {
      label: 'Java',
      quadrant: 2,
      since: 'Mar 20, 2018',
      ring: 0,
      ringName: 'Adopt',
      moved: false,
      link: '/entries/java.html',
      active: true,
    },
    description: 'Description',
    rationale: 'Rationale',
    related: [
      { file: 'php.html', name: 'PHP' },
    ],
    quadrant: { index: 2, dirname: 'dev' },
    filename: 'java.html',
  },
  lisp: {
    name: 'Lisp',
    blip: {
      label: 'Lisp',
      quadrant: 2,
      since: 'Jan 1, 1970',
      ring: 3,
      ringName: 'Hold',
      moved: false,
      link: '/entries/lisp.html',
      active: false,
      history: [
        { date: 'Jan 1, 1970', ringName: 'Adopt' },
        { date: 'Mar 20, 2018', ringName: 'Hold' },
      ],
    },
    description: 'Description',
    rationale: 'Rationale',
    quadrant: { index: 2, dirname: 'dev' },
    filename: 'lisp.html',
  },
  php: {
    name: 'PHP',
    logo: 'https://www.php.net/images/logos/php-logo.svg',
    blip: {
      label: 'PHP',
      quadrant: 2,
      since: 'Jan 1, 2004',
      ring: 3,
      ringName: 'Hold',
      moved: false,
      link: '/entries/php.html',
      active: true,
      history: [
        { date: 'Jan 1, 2004', ringName: 'Adopt' },
        { date: 'Mar 20, 2018', ringName: 'Hold' },
      ],
    },
    description: 'Description',
    rationale: 'Rationale',
    quadrant: { index: 2, dirname: 'dev' },
    filename: 'php.html',
  },
};

jest.mock('../js/modules/radarService', () => ({
  getEntry: entry => mockEntries[entry],
  model: {
    quadrants: [
      { name: 'Development', dirname: 'dev' },
    ],
  },
}));

describe('<Entry />', () => {
  test('It renders entry with related links', () => {
    const match = { params: { id: 'java' } };
    const component = shallow(<Entry match={match} />);
    expect(component).toMatchSnapshot();
  });

  test('It renders entry with history', () => {
    const match = { params: { id: 'php' } };
    const component = shallow(<Entry match={match} />);
    expect(component).toMatchSnapshot();
  });

  test('It renders logotype if present', () => {
    const match = { params: { id: 'php' } };
    const component = shallow(<Entry match={match} />);
    expect(component.find('img')).toHaveLength(1);
    expect(component).toMatchSnapshot();
  });

  test('It renders inactive badge', () => {
    const match = { params: { id: 'lisp' } };
    const component = shallow(<Entry match={match} />);
    expect(component.find('.inactive')).toHaveLength(1);
    expect(component).toMatchSnapshot();
  });
});
