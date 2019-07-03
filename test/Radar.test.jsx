import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import Radar from '../src/js/components/Radar';

jest.mock('../src/js/modules/radarService');

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
    const component = mount(
      <MemoryRouter>
        <Radar history={{ push: jest.fn() }} />
      </MemoryRouter>,
      { attachTo: window.domNode },
    );
    expect(document.querySelectorAll('g.blip')).toHaveLength(2);
    component.unmount();
  });

  test('It is possible to click radar blips', () => {
    const clickFn = jest.fn();
    const component = mount(
      <MemoryRouter>
        <Radar history={{ push: clickFn }} />
      </MemoryRouter>,
      { attachTo: window.domNode },
    );
    document.querySelectorAll('g.blip')[0].dispatchEvent(new Event('click'));
    expect(clickFn.mock.calls.length).toEqual(1);
    component.unmount();
  });

  test('It is possible to filter the radar blips', () => {
    const component = mount(
      <MemoryRouter>
        <Radar history={{ push: jest.fn() }} />
      </MemoryRouter>,
      { attachTo: window.domNode },
    );

    expect(document.querySelectorAll('g.blip')).toHaveLength(2);

    // Apply filter
    const radar = component.find(Radar);
    radar.instance().onFilter([{ id: 1, name: 'java' }]);

    expect(radar.state().tags).toEqual(['java']);
    expect(document.querySelectorAll('g.blip')).toHaveLength(1);

    component.unmount();
  });
});
