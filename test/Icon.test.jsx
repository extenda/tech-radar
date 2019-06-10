import React from 'react';
import { shallow } from 'enzyme';
import Icon from '../src/js/components/Icon';

describe('<Icon />', () => {
  test('It renders icon with space before and after', () => {
    const icon = shallow(<Icon name="test" />);
    expect(icon).toMatchSnapshot();
  });

  test('It renders icon with space after', () => {
    const icon = shallow(<Icon name="test" spaceBefore={false} />);
    expect(icon).toMatchSnapshot();
  });

  test('It appends the icon prefix to className', () => {
    const icon = shallow(<Icon name="test" />);
    expect(icon.find('.fa-test')).toHaveLength(1);
  });
});
