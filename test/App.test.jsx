import React from 'react';
import * as reactRouter from 'react-router-dom';
import { shallow, mount } from 'enzyme';
import { App } from '../src/js/components/App';
import Entry from '../src/js/components/Entry';
import Quadrant from '../src/js/components/Quadrant';
import NotFound from '../src/js/components/NotFound';
import TagList from '../src/js/components/TagList';
import Logout from '../src/js/components/Logout';
import Login from '../src/js/components/Login';
import sha256 from '../src/js/modules/sha256';

jest.mock('../src/js/modules/sha256');

jest.mock('../src/js/components/Radar', () => () => (
  <div id="radar">
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
  let spyConsole;
  beforeAll(() => {
    sha256.mockResolvedValue('mock-sha');
    spyConsole = jest.spyOn(console, 'error').mockImplementation();
  });
  afterAll(() => {
    spyConsole.mockRestore();
    sha256.mockRestore();
  });

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
    window.history.pushState({}, '', '/');
    const identify = jest.fn().mockResolvedValueOnce({});
    const component = mount(<App ldClient={{ identify }} />);
    await component.instance().loginDidSucceed({ tokenId: 'test', profileObj: { googleId: 1, email: 'mail' } });
    await component.update();
    expect(component.state().isSignedIn).toEqual(true);
    expect(component.state().loading).toEqual(false);
    expect(component.find(Logout)).toHaveLength(1);
    expect(component.find('#radar')).toHaveLength(1);
  });

  test('It does not render Radar on invalid JWT', async () => {
    window.history.pushState({}, '', '/');
    const identify = jest.fn().mockResolvedValueOnce({});
    const component = mount(<App ldClient={{ identify }} />);
    await component.instance().loginDidSucceed({ tokenId: 'fail', profileObj: { googleId: 1, email: 'mail' } });
    await component.update();
    expect(component.state().isSignedIn).toEqual(false);
    expect(component.state().loading).toEqual(true);

    // We need to render one more time to update for the state set from the failure.
    await component.update();
    expect(component.find(Login)).toHaveLength(1);
  });

  test('It renders the radar on / route', async () => {
    window.history.pushState({}, '', '/');
    const component = mount(<App />);
    component.setState({ isSignedIn: true, loading: false });
    await component.update();
    expect(component.state().isSignedIn).toEqual(true);
    expect(component.find('#radar')).toHaveLength(1);
  });

  test('It renders <Logout /> on / route', async () => {
    window.history.pushState({}, '', '/');
    const component = mount(<App />);
    component.setState({ isSignedIn: true, loading: false });
    await component.update();
    expect(component.state().isSignedIn).toEqual(true);
    expect(component.find(Logout)).toHaveLength(1);
  });

  test('It renders quadrant on /*.html route', async () => {
    window.history.pushState({}, '', '/dev.html');
    const component = mount(<App />);
    component.setState({ isSignedIn: true, loading: false });
    await component.update();
    expect(component.find(Quadrant)).toHaveLength(1);
  });

  test('It renders entry on /entries/*.html route', async () => {
    window.history.pushState({}, '', '/entries/java.html');
    const component = mount(<App />);
    component.setState({ isSignedIn: true, loading: false });
    await component.update();
    expect(component.find(Entry)).toHaveLength(1);
  });

  test('It renders not found for invalid URL', async () => {
    window.history.pushState({}, '', '/notfound');
    const component = mount(<App />);
    component.setState({ isSignedIn: true, loading: false });
    await component.update();
    expect(component.find(NotFound)).toHaveLength(1);
  });

  test('It renders tag list no /tags/*.html route', async () => {
    window.history.pushState({}, '', '/tags/java.html');
    const component = mount(<App />);
    component.setState({ isSignedIn: true, loading: false });
    await component.update();

    expect(component.find(TagList)).toHaveLength(1);
  });
});
