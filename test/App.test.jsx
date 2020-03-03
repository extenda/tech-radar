import React from 'react';
import * as reactRouter from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import App from '../src/js/components/App';
import Radar from '../src/js/components/Radar';
import Entry from '../src/js/components/Entry';
import Quadrant from '../src/js/components/Quadrant';
import NotFound from '../src/js/components/NotFound';
import TagList from '../src/js/components/TagList';
import Logout from '../src/js/components/Logout';
import Login from '../src/js/components/Login';

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

jest.mock('../src/js/components/Login', () => () => (
  <div>
    Login
  </div>
));

jest.mock('../src/js/components/Logout', () => () => (
  <div>
    Logout
  </div>
));

jest.mock('../src/js/modules/radarService');

describe('<App />', () => {
  test('It renders <Login /> if not authenticated', async () => {
    const component = mount(<App />);
    expect(component.state().isSignedIn).toEqual(false);
    expect(component).toMatchSnapshot();
  });

  test('It renders nothing before radar is loaded', async () => {
    const component = shallow(<App />);
    component.setState({ isSignedIn: true, loading: true });
    await component.update();
    expect(component.state().isSignedIn).toEqual(true);
    expect(component.state().loading).toEqual(true);
    expect(component).toMatchSnapshot();
  });

  test('It renders Radar on successful login', async () => {
    reactRouter.BrowserRouter = mockRouter('/');
    const component = mount(<App />);
    await component.instance().loginDidSucceed({ tokenId: 'test' });
    await component.update();
    expect(component.state().isSignedIn).toEqual(true);
    expect(component.state().loading).toEqual(false);
    expect(component.find(Logout)).toHaveLength(1);
    expect(component.find(Radar)).toHaveLength(1);
  });

  test('It does not render Radar on invalid JWT', async () => {
    reactRouter.BrowserRouter = mockRouter('/');
    const component = mount(<App />);
    await component.instance().loginDidSucceed({ tokenId: 'fail' });
    await component.update();
    expect(component.state().isSignedIn).toEqual(false);
    expect(component.state().loading).toEqual(true);

    // We need to render one more time to update for the state set from the failure.
    await component.update();
    expect(component.find(Login)).toHaveLength(1);
  });

  test('It renders the radar on / route', async () => {
    reactRouter.BrowserRouter = mockRouter('/');
    const component = mount(<App />);
    component.setState({ isSignedIn: true, loading: false });
    await component.update();
    expect(component.state().isSignedIn).toEqual(true);
    expect(component.find(Radar)).toHaveLength(1);
  });

  test('It renders <Logout /> on / route', async () => {
    reactRouter.BrowserRouter = mockRouter('/');
    const component = mount(<App />);
    component.setState({ isSignedIn: true, loading: false });
    await component.update();
    expect(component.state().isSignedIn).toEqual(true);
    expect(component.find(Logout)).toHaveLength(1);
  });

  test('It renders quadrant on /*.html route', async () => {
    reactRouter.BrowserRouter = mockRouter('/dev.html');
    const component = mount(<App />);
    component.setState({ isSignedIn: true, loading: false });
    expect(component.find(Quadrant)).toHaveLength(1);
  });

  test('It renders entry on /entries/*.html route', async () => {
    reactRouter.BrowserRouter = mockRouter('/entries/java.html');
    const component = mount(<App />);
    component.setState({ isSignedIn: true, loading: false });
    await component.update();
    expect(component.find(Entry)).toHaveLength(1);
  });

  test('It renders not found for invalid URL', async () => {
    reactRouter.BrowserRouter = mockRouter('/notfound');
    const component = mount(<App />);
    component.setState({ isSignedIn: true, loading: false });
    await component.update();
    expect(component.find(NotFound)).toHaveLength(1);
  });

  test('It renders tag list no /tags/*.html route', async () => {
    reactRouter.BrowserRouter = mockRouter('/tags/java.html');
    const component = mount(<App />);
    component.setState({ isSignedIn: true, loading: false });
    await component.update();
    expect(component.find(TagList)).toHaveLength(1);
  });
});
