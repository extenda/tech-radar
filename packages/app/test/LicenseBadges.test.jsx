import { shallow } from 'enzyme';
import React from 'react';

import Badge from '../src/js/components/entry/Badge';
import LicenseBadges from '../src/js/components/entry/LicenseBadges';

describe('<LicenseBadges />', () => {
  test('It renders no badges for missing license', () => {
    const component = shallow(<LicenseBadges />);
    expect(component).toMatchSnapshot();
    expect(component.find(Badge)).toHaveLength(0);
  });

  test('It renders open-source badge', () => {
    const component = shallow(
      <LicenseBadges
        license={{
          openSource: {
            name: 'MIT',
            link: 'https://license.com',
          },
        }}
      />,
    );

    expect(component).toMatchSnapshot();
    expect(component.find(Badge)).toHaveLength(1);
  });

  test('It renders commercial badge', () => {
    const component = shallow(
      <LicenseBadges
        license={{
          commercial: {
            company: 'Oracle',
          },
        }}
      />,
    );

    expect(component).toMatchSnapshot();
    expect(component.find(Badge)).toHaveLength(1);
  });

  test('It renders dual license', () => {
    const component = shallow(
      <LicenseBadges
        license={{
          commercial: {
            company: 'Oracle',
          },
          openSource: {
            name: 'MIT',
            link: 'https://license.com',
          },
        }}
      />,
    );

    expect(component.find(Badge)).toHaveLength(2);
  });
});
