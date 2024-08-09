import { mount } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import QuadrantList from '../src/js/components/QuadrantList';
import radarService from '../src/js/modules/radarService';

jest.mock('../src/js/modules/radarService');

describe('<QuadrantList/>', () => {
  test('It renders a list for visual Radar', () => {
    const component = mount(
      <MemoryRouter initialEntries={[{ pathname: '/', key: 'test' }]}>
        <QuadrantList
          quadrant={radarService.getQuadrant('test', false)}
          onMouseEnter={jest.fn()}
          onMouseLeave={jest.fn()}
          headerLevel={2}
          useShortname
          blips={radarService.listBlips()}
        />
      </MemoryRouter>,
    );
    expect(component).toMatchSnapshot();
  });

  test('It renders a list for Quandrant page', () => {
    const component = mount(
      <MemoryRouter initialEntries={[{ pathname: '/', key: 'test' }]}>
        <QuadrantList quadrant={radarService.getQuadrant('test')} />
      </MemoryRouter>,
    );
    expect(component).toMatchSnapshot();
  });
});
