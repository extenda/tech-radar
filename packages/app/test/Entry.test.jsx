import { shallow } from 'enzyme';
import React from 'react';

import Entry from '../src/js/components/Entry';
import NotFound from '../src/js/components/NotFound';

jest.mock('../src/js/modules/radarService');

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

  test('It renders inactive statement', () => {
    const match = { params: { id: 'lisp' } };
    const component = shallow(<Entry match={match} />);
    expect(component.find('.inactive-note')).toHaveLength(1);
    expect(component).toMatchSnapshot();
  });

  test('It renders Not Found for missing entry', () => {
    const match = { params: { id: 'missing' } };
    const component = shallow(<Entry match={match} />);
    expect(component.find(NotFound)).toHaveLength(1);
    expect(component).toMatchSnapshot();
  });
});
