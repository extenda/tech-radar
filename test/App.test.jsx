import React from 'react';
import * as reactRouter from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import App from '../src/js/components/App';
import Radar from '../src/js/components/Radar';
import Entry from '../src/js/components/Entry';
import Quadrant from '../src/js/components/Quadrant';
import NotFound from '../src/js/components/NotFound';
import TagList from '../src/js/components/TagList';

const { MemoryRouter } = reactRouter;

// eslint-disable-next-line react/prop-types
const mockRouter = initialEntry => ({ children }) => (
  <MemoryRouter initialEntries={[initialEntry]}>
    {children}
  </MemoryRouter>
);

jest.mock('../src/js/components/Radar', () => () => (
  <div>
    Radar
  </div>
));

jest.mock('../src/js/components/Entry', () => () => (
  <div>
    Entry
  </div>
));

jest.mock('../src/js/components/Quadrant', () => () => (
  <div>
    Quadrant
  </div>
));

jest.mock('../src/js/components/NotFound', () => () => (
  <div>
    NotFound
  </div>
));

jest.mock('../src/js/components/TagList', () => () => (
  <div>
    TagList
  </div>
));

jest.mock('../src/js/modules/radarService');

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

  test('It renders not found for invalid URL', async () => {
    reactRouter.BrowserRouter = mockRouter('/notfound');
    const component = await mount(<App />);
    component.update();
    expect(component.find(NotFound)).toHaveLength(1);
  });

  test('It renders tag list no /tags/*.html route', async () => {
    reactRouter.BrowserRouter = mockRouter('/tags/java.html');
    const component = await mount(<App />);
    component.update();
    expect(component.find(TagList)).toHaveLength(1);
  });
});
