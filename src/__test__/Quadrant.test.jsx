import React from 'react';
import { shallow } from 'enzyme';
import Quadrant from '../js/components/Quadrant';

jest.mock('../js/modules/radarService', () => ({
  getQuadrant: () => ({
    name: 'Test',
    dirname: 'test1',
    adopt: [
      { name: 'A - 1', filename: '1.html' },
      { name: 'B - 2', filename: '2.html' },
    ],
    trial: [],
    assess: [
      { name: 'C - 3', filename: '3.html' },
    ],
    hold: [
      { name: 'D - 4', filename: '4.html' },
      { name: 'E - 5', filename: '5.html' },
      { name: 'F - 6', filename: '6.html' },
    ],
  }),
}));

describe('<Quadrant />', () => {
  test('It groups entries by ring', () => {
    const match = { params: { quadrant: 'test' } };
    const component = shallow(<Quadrant match={match} />);

    expect(component.find('ul.adopt > li')).toHaveLength(2);
    expect(component.find('ul.trial > li')).toHaveLength(0);
    expect(component.find('ul.assess > li')).toHaveLength(1);
    expect(component.find('ul.hold > li')).toHaveLength(3);
  });

  test('It renders as expected', () => {
    const match = { params: { quadrant: 'test' } };
    const component = shallow(<Quadrant match={match} />);
    expect(component).toMatchSnapshot();
  });
});
