import { mount } from 'enzyme';
import React from 'react';

import Logout from '../src/js/components/Logout';

jest.mock('../src/js/modules/radarService');

describe('<Logout />', () => {
  test('It renders logout button', () => {
    const component = mount(<Logout />);
    expect(component).toMatchSnapshot();
  });
});
