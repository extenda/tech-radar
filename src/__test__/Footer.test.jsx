import React from 'react';
import { shallow } from 'enzyme';
import Footer from '../js/components/Footer';

jest.mock('../js/modules/radarService');

describe('<Footer />', () => {
  test('It renders the footer', () => {
    const footer = shallow(<Footer />);
    expect(footer).toMatchSnapshot();
  });
});
