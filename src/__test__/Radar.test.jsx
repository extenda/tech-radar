import React from 'react';
import { shallow, mount } from 'enzyme';
import Radar from '../js/components/Radar';

jest.mock('../js/modules/radarService', () => ({
  listBlips: () => [
    {
      label: 'Java',
      quadrant: 2,
      ring: 0,
      moved: false,
      link: '/entries/java.html',
      active: true,
    },
    {
      label: 'PHP',
      quadrant: 2,
      ring: 3,
      moved: false,
      link: '/entries/php.html',
      active: true,
    },
  ],
  model: {
    quadrants: [
      { name: 'Test 1', dirname: 'test1' },
      { name: 'Test 2', dirname: 'test2' },
      { name: 'Test 3', dirname: 'test3' },
      { name: 'Test 4', dirname: 'test4' },
    ],
    rings: [
      'ADOPT',
      'TRIAL',
      'ASSESS',
      'HOLD',
    ],
  },
}));

describe('<Radar />', () => {
  beforeAll(() => {
    const div = document.createElement('div');
    window.domNode = div;
    document.body.appendChild(div);
  });

  afterAll(() => {
    document.body.removeChild(window.domNode);
    window.domNode = null;
  });

  test('It renders the SVG radar and description', () => {
    const component = shallow(<Radar history={{ push: jest.fn() }} />);
    expect(component).toMatchSnapshot();
  });

  test('It renders the radar blips in SVG', () => {
    mount(<Radar history={{ push: jest.fn() }} />, { attachTo: window.domNode });
    expect(document.querySelectorAll('g.blip')).toHaveLength(2);
  });

  test('It is possible to click radar blips', () => {
    const clickFn = jest.fn();
    mount(<Radar history={{ push: clickFn }} />, { attachTo: window.domNode });
    document.querySelectorAll('g.blip')[0].dispatchEvent(new Event('click'));
    expect(clickFn.mock.calls.length).toEqual(1);
  });
});
