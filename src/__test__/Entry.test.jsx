import React from 'react';
import { shallow } from 'enzyme';
import Entry from '../js/components/Entry';

jest.mock('../js/modules/radarService');

describe('<Entry />', () => {
  test('It renders entry with related links', () => {
    const match = { params: { id: 'java' } };
    const component = shallow(<Entry match={match} />);
    expect(component).toMatchSnapshot();
  });

  test('It renders entry with history', () => {
    const match = { params: { id: 'php' } };
    const component = shallow(<Entry match={match} />);
    expect(component).toMatchSnapshot();
  });

  test('It renders logotype if present', () => {
    const match = { params: { id: 'php' } };
    const component = shallow(<Entry match={match} />);
    expect(component.find('img')).toHaveLength(1);
    expect(component).toMatchSnapshot();
  });

  test('It renders inactive badge', () => {
    const match = { params: { id: 'lisp' } };
    const component = shallow(<Entry match={match} />);
    expect(component.find('.inactive')).toHaveLength(1);
    expect(component).toMatchSnapshot();
  });
});
