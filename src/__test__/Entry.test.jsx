import React from 'react';
import { mount, shallow } from 'enzyme';
import { MemoryRouter, Link } from 'react-router-dom';
import Entry, { History, Related, Badge } from '../js/components/Entry';

const mockEntries = {
  java: {
    name: 'Java',
    blip: {
      label: 'Java',
      quadrant: 2,
      since: 'Mar 20, 2018',
      ring: 0,
      ringName: 'Adopt',
      moved: false,
      link: '/entries/java.html',
      active: true,
    },
    description: 'Description',
    rationale: 'Rationale',
    related: [
      { file: 'php.html', name: 'PHP' },
    ],
    quadrant: { index: 2, dirname: 'dev' },
    filename: 'java.html',
  },
  php: {
    name: 'PHP',
    blip: {
      label: 'PHP',
      quadrant: 2,
      since: 'Jan 1, 2004',
      ring: 3,
      ringName: 'Hold',
      moved: false,
      link: '/entries/php.html',
      active: true,
      history: [
        { date: 'Jan 1, 2004', ringName: 'Adopt' },
        { date: 'Mar 20, 2018', ringName: 'Hold' },
      ],
    },
    description: 'Description',
    rationale: 'Rationale',
    quadrant: { index: 2, dirname: 'dev' },
    filename: 'php.html',
  },
};

jest.mock('../js/modules/radarService', () => ({
  getEntry: entry => mockEntries[entry],
}));

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

  describe('<History />', () => {
    test('It renders history entries', () => {
      const component = shallow(<History history={mockEntries.php.blip.history} />);
      expect(component).toMatchSnapshot();
      expect(component.find('li')).toHaveLength(2);
    });

    test('It renders nothing for missing history', () => {
      const component = shallow(<History history={[]} />);
      expect(component).toMatchSnapshot();
    });
  });

  describe('<Related />', () => {
    test('It renders related entries', () => {
      const component = shallow(<Related related={mockEntries.java.related} />);
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
          <Related related={mockEntries.java.related} />
        </MemoryRouter>,
      );

      const { history } = component.find(MemoryRouter).instance();
      expect(history.length).toEqual(1);

      component.find(Link).first().simulate('click', { button: 0 });

      expect(history.length).toEqual(2);
      expect(history.location.pathname).toEqual('/php.html');
    });
  });

  describe('<Badge />', () => {
    test('It renders badge with icon', () => {
      const component = shallow(<Badge icon="test" text="test" />);
      expect(component).toMatchSnapshot();
    });

    test('It renders badge with extra className', () => {
      const component = shallow(<Badge icon="test" text="test" className="my-test" />);
      expect(component).toMatchSnapshot();
    });
  });
});
