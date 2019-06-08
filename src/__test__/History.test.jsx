import React from 'react';
import { shallow } from 'enzyme/build';
import History from '../js/components/entry/History';

const history = [
  { date: 'Jan 1, 2004', ringName: 'Adopt' },
  { date: 'Mar 20, 2018', ringName: 'Hold' },
];

describe('<History />', () => {
  test('It renders history entries', () => {
    const component = shallow(<History history={history} />);
    expect(component).toMatchSnapshot();
    expect(component.find('li')).toHaveLength(2);
  });

  test('It renders nothing for missing history', () => {
    const component = shallow(<History history={[]} />);
    expect(component).toMatchSnapshot();
  });
});
