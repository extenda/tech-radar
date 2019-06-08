import React from 'react';
import { mount, shallow } from 'enzyme/build';
import { Link, MemoryRouter } from 'react-router-dom';
import Related from '../js/components/entry/Related';

const related = [
  { file: 'php.html', name: 'PHP' },
];

describe('<Related />', () => {
  test('It renders related entries', () => {
    const component = shallow(<Related related={related} />);
    expect(component).toMatchSnapshot();
    expect(component.find('li')).toHaveLength(1);
  });

  test('It renders nothing for no relations', () => {
    const component = shallow(<Related related={[]} />);
    expect(component).toMatchSnapshot();
  });

  test('It is possible to click related link', async () => {
    const component = mount(
      <MemoryRouter>
        <Related related={related} />
      </MemoryRouter>,
    );

    const { history } = component.find(MemoryRouter).instance();
    expect(history.length).toEqual(1);

    component.find(Link).first().simulate('click', { button: 0 });

    expect(history.length).toEqual(2);
    expect(history.location.pathname).toEqual('/php.html');
  });
});
