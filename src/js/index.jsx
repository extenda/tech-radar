import React from 'react';
import ReactDOM from 'react-dom';
import { withLDProvider } from 'launchdarkly-react-client-sdk';
import LDApp from './components/App';
import '../assets/favicon.ico';
import '../assets/css/main.css';

const LDWrapper = withLDProvider({
  // eslint-disable-next-line no-undef
  clientSideID: LD_CLIENT_ID,
})(() => <LDApp />);

ReactDOM.render(
  <LDWrapper />,
  document.getElementById('app'),
);
