import React from 'react';
import { shallow } from 'enzyme/build';
import Badge from '../js/components/entry/Badge';

describe('<Badge />', () => {
  test('It renders badge with icon', () => {
    const component = shallow(<Badge icon="test" text="test" />);
    expect(component).toMatchSnapshot();
  });

  test('It renders badge with extra className', () => {
    const component = shallow(<Badge icon="test" text="test" className="my-test" />);
    expect(component).toMatchSnapshot();
  });
});
