import React from 'react';
import { shallow } from 'enzyme/build';
import TagsInput from '../src/js/components/TagsInput';

const tags = ['java', 'php'];

describe('<TagsInput />', () => {
  test('It can render input', () => {
    const component = shallow(<TagsInput onFilter={jest.fn()} tags={tags} />);
    expect(component).toMatchSnapshot();
  });

  test('It can add filter tags', () => {
    const onFilter = jest.fn();
    const component = shallow(<TagsInput onFilter={onFilter} tags={tags} />);
    component.instance().handleAddition({ id: 0, name: 'java' });
    expect(onFilter.mock.calls).toHaveLength(1);
    expect(onFilter.mock.calls[0][0]).toMatchObject([
      { id: 0, name: 'java' },
    ]);

    component.instance().handleAddition({ id: 1, name: 'php' });
    expect(onFilter.mock.calls).toHaveLength(2);
    expect(onFilter.mock.calls[1][0]).toMatchObject([
      { id: 0, name: 'java' },
      { id: 1, name: 'php' },
    ]);
  });

  test('It can remove filter tags', () => {
    const onFilter = jest.fn();
    const component = shallow(<TagsInput onFilter={onFilter} tags={tags} />);
    component.instance().handleAddition({ id: 0, name: 'java' });
    component.instance().handleAddition({ id: 1, name: 'php' });
    expect(onFilter.mock.calls).toHaveLength(2);

    component.instance().handleDelete(0);
    expect(onFilter.mock.calls[2][0]).toMatchObject([
      { id: 1, name: 'php' },
    ]);

    component.instance().handleDelete(0);
    expect(onFilter.mock.calls[3][0]).toMatchObject([]);
  });
});
