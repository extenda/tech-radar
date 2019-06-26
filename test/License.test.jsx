import React from 'react';
import { shallow } from 'enzyme';
import License from '../src/js/components/entry/License';

describe('<License />', () => {
  test('It renders nothing for missing license', () => {
    const component = shallow(<License />);
    expect(component).toMatchSnapshot();
  });

  test('It renders open-source license', () => {
    const component = shallow(<License license={{ openSource: { name: 'MIT' } }} />);
    expect(component).toMatchSnapshot();
    expect(component.html()).toMatch('The MIT License');
  });

  test('It renders open-source license with link', () => {
    const component = shallow(<License license={{ openSource: { name: 'MIT', link: 'https://license.com' } }} />);
    expect(component).toMatchSnapshot();
    expect(component.find('a')).toHaveLength(1);
  });

  test('It renders commercial license', () => {
    const component = shallow(<License license={{ commercial: 'License text.' }} />);
    expect(component).toMatchSnapshot();
    expect(component.html()).toMatch('License text');
  });

  test('It renders dual license', () => {
    const component = shallow(
      <License
        license={{
          commercial: 'License text.',
          openSource: { name: 'MIT' },
        }}
      />,
    );
    expect(component).toMatchSnapshot();
    expect(component.html()).toMatch('The MIT License');
    expect(component.html()).toMatch('License text');
  });
});