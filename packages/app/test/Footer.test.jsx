import { shallow } from 'enzyme';
import React from 'react';

import Footer from '../src/js/components/Footer';

jest.mock('../src/js/modules/radarService');

describe('<Footer />', () => {
  test('It renders the footer', () => {
    const footer = shallow(<Footer />);
    expect(footer).toMatchSnapshot();
  });
});
