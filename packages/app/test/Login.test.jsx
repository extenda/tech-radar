import React from 'react';
import { shallow } from 'enzyme';
import Login from '../src/js/components/Login';

jest.mock('../src/js/modules/radarService');

describe('<Login />', () => {
  test('It renders login view', () => {
    const component = shallow(
      <Login onFailure={jest.fn} onSuccess={jest.fn} />,
    );
    expect(component).toMatchSnapshot();
  });
});
