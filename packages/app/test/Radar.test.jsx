import { mount, shallow } from 'enzyme';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { Radar } from '../src/js/components/Radar';

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

  test('It renders IT & BIS radar switch', () => {
    const component = shallow(
      <Radar
        history={{ push: jest.fn() }}
        flags={{ releaseToolRadar: true }}
      />,
    );
    expect(component).toMatchSnapshot();
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

  test('It reacts to mouse events on quadrants listings', () => {
    const component = mount(
      <MemoryRouter>
        <Radar history={{ push: jest.fn() }} />
      </MemoryRouter>,
      { attachTo: window.domNode },
    );

    const showBubble = jest
      .spyOn(component.find(Radar).instance().svgRadar, 'showBubble')
      .mockImplementationOnce(() => {});

    const legendItem = component.find('#legendItem1').at(0);

    // Simulate a mouse enter from the DOM element
    legendItem.find('a').at(0).simulate('mouseEnter');

    expect(showBubble).toHaveBeenCalled();
    expect(legendItem.getDOMNode().className).toContain('radar-highlight');

    // Simulate a mouse leave from the DOM element
    legendItem.find('a').at(0).simulate('mouseLeave');

    expect(legendItem.getDOMNode().className).not.toContain('radar-highlight');

    component.unmount();
    showBubble.mockRestore();
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

    expect(document.querySelectorAll('g.blip')).toHaveLength(1);

    component.unmount();
  });
});
