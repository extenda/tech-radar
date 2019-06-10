import React from 'react';
import { shallow } from 'enzyme';
import Quadrant from '../src/js/components/Quadrant';

jest.mock('../src/js/modules/radarService');

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
