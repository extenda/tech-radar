import { shallow } from 'enzyme';
import React from 'react';

import NotFound from '../src/js/components/NotFound';

jest.mock('../src/js/modules/radarService');

describe('<NotFound />', () => {
  test('It renders not found', () => {
    const component = shallow(<NotFound />);
    expect(component).toMatchSnapshot();
  });
});
