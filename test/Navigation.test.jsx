import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';
import Navigation from '../src/js/components/Navigation';

describe('<Navigation />', () => {
  test('It renders home menu', () => {
    const home = [
      { name: 'Test 1', dirname: 'test1' },
      { name: 'Test 2', dirname: 'test2' },
      { name: 'Test 3', dirname: 'test3' },
      { name: 'Test 4', dirname: 'test4' },
    ];
    const component = shallow(<Navigation home={home} />);
    expect(component.find(Link)).toHaveLength(5);
    expect(component).toMatchSnapshot();
  });

  test('It renders quadrant breadcrumbs', () => {
    const component = shallow(<Navigation quadrant={{ name: 'Test1', dirname: 'test1' }} />);
    expect(component.find(Link)).toHaveLength(1);
    expect(component).toMatchSnapshot();
  });

  test('It renders entry breadcrumbs', () => {
    const component = shallow(
      <Navigation
        quadrant={{ name: 'Test1', dirname: 'test1' }}
        entry={{ name: 'Entry' }}
      />,
    );

    expect(component.find(Link)).toHaveLength(2);
    expect(component).toMatchSnapshot();
  });

  test('It renders tag breadcrumbs', () => {
    const component = shallow(<Navigation tag="java" />);
    expect(component.find(Link)).toHaveLength(1);
    expect(component).toMatchSnapshot();
  });
});
