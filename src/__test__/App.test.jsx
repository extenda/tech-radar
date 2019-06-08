import React from 'react';
import * as reactRouter from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import App from '../js/components/App';
import Radar from '../js/components/Radar';
import Entry from '../js/components/Entry';
import Quadrant from '../js/components/Quadrant';

const { MemoryRouter } = reactRouter;

// eslint-disable-next-line react/prop-types
const mockRouter = initialEntry => ({ children }) => (
  <MemoryRouter initialEntries={[initialEntry]}>
    {children}
  </MemoryRouter>
);

jest.mock('../js/components/Radar', () => () => (
  <div>
    Radar
  </div>
));

jest.mock('../js/components/Entry', () => () => (
  <div>
    Entry
  </div>
));

jest.mock('../js/components/Quadrant', () => () => (
  <div>
    Quadrant
  </div>
));

jest.mock('../js/modules/radarService', () => {
  const quadrants = [
    { name: 'Test 1', dirname: 'test1' },
    { name: 'Test 2', dirname: 'test2' },
    { name: 'Test 3', dirname: 'test3' },
    { name: 'Test 4', dirname: 'test4' },
  ];
  return {
    init: () => Promise.resolve(true),
    listBlips: jest.fn(() => []),
    getQuadrant: jest.fn(),
    getEntry: jest.fn(),
    model: {
      title: 'Test',
      formattedDate: '4 June, 2019',
      version: '0.0.1-local',
      quadrants,
      quadrantsNavBar: quadrants,
    },
  };
});

describe('<App />', () => {
  test('It renders nothing before radar is loaded', () => {
    const component = shallow(<App />);
    expect(component.state().loading).toEqual(true);
    expect(component).toMatchSnapshot();
  });

  test('It renders the radar on / route', async () => {
    reactRouter.BrowserRouter = mockRouter('/');
    const component = await mount(<App />);
    component.update();
    expect(component.find(Radar)).toHaveLength(1);
  });

  test('It renders quadrant on /*.html route', async () => {
    reactRouter.BrowserRouter = mockRouter('/dev.html');
    const component = await mount(<App />);
    component.update();
    expect(component.find(Quadrant)).toHaveLength(1);
  });

  test('It renders entry on /entries/*.html route', async () => {
    reactRouter.BrowserRouter = mockRouter('/entries/java.html');
    const component = await mount(<App />);
    component.update();
    expect(component.find(Entry)).toHaveLength(1);
  });
});
