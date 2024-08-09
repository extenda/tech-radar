import { mount, shallow } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import NotFound from '../src/js/components/NotFound';
import Quadrant from '../src/js/components/Quadrant';

jest.mock('../src/js/modules/radarService');

describe('<Quadrant />', () => {
  test('It groups entries by ring', () => {
    const match = { params: { quadrant: 'test' } };
    const component = mount(
      <MemoryRouter>
        <Quadrant match={match} />
      </MemoryRouter>,
    );

    expect(component.find('ol.adopt > li')).toHaveLength(2);
    expect(component.find('ol.trial > li')).toHaveLength(0);
    expect(component.find('ol.assess > li')).toHaveLength(1);
    expect(component.find('ol.hold > li')).toHaveLength(3);
    component.unmount();
  });

  test('It renders as expected', () => {
    const match = { params: { quadrant: 'test' } };
    const component = shallow(<Quadrant match={match} />);
    expect(component).toMatchSnapshot();
  });

  test('It renders not found for invalid quadrant', () => {
    const match = { params: { quadrant: 'missing' } };
    const component = shallow(<Quadrant match={match} />);
    expect(component.find(NotFound)).toHaveLength(1);
    expect(component).toMatchSnapshot();
  });

  test('It renders inactive style for archived entries', () => {
    const match = { params: { quadrant: 'test' } };
    const component = mount(
      <MemoryRouter>
        <Quadrant match={match} />
      </MemoryRouter>,
    );
    expect(component.find('a.inactive')).toHaveLength(1);
    component.unmount();
  });
});
