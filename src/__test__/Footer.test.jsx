import React from 'react';
import { shallow } from 'enzyme';
import Footer from '../js/components/Footer';

jest.mock('../js/modules/radarService', () => ({
  model: {
    title: 'Test',
    version: '0.0.1-local',
    formattedDate: '5 June 2019',
  },
}));

describe('<Footer />', () => {
  test('It renders the footer', () => {
    const footer = shallow(<Footer />);
    expect(footer).toMatchSnapshot();
  });
});
