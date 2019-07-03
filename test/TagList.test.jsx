import React from 'react';
import { Link } from 'react-router-dom';
import { shallow } from 'enzyme/build';
import TagList from '../src/js/components/TagList';

jest.mock('../src/js/modules/radarService');

describe('<TagList />', () => {
  test('It can list tagged entries', () => {
    const component = shallow(<TagList match={{ params: { tag: 'java' } }} />);
    expect(component.find(Link)).toHaveLength(1);
    expect(component).toMatchSnapshot();
  });
});
