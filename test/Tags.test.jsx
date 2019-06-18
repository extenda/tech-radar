import React from 'react';
import { Link, MemoryRouter } from 'react-router-dom';
import { mount, shallow } from 'enzyme/build';
import Tags from '../src/js/components/entry/Tags';

describe('<Tags />', () => {
  test('It renders nothing for no tags', () => {
    const component = shallow(<Tags tags={[]} />);
    expect(component).toMatchSnapshot();
  });

  test('It renders a list of tags', () => {
    const component = shallow(<Tags tags={['a', 'b', 'c']} />);
    expect(component.find(Link)).toHaveLength(3);
    expect(component).toMatchSnapshot();
  });

  test('It is possible to click tag', () => {
    const component = mount(
      <MemoryRouter>
        <Tags tags={['a', 'b', 'c']} />
      </MemoryRouter>,
    );

    const { history } = component.find(MemoryRouter).instance();
    expect(history.length).toEqual(1);

    component.find(Link).first().simulate('click', { button: 0 });

    expect(history.length).toEqual(2);
    expect(history.location.pathname).toEqual('/tags/a.html');
  });
});
