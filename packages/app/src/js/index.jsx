import '../assets/favicon.ico';
import '../assets/css/main.css';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { clientId } from '@tech-radar/shared/src/auth-config';
import { withLDProvider } from 'launchdarkly-react-client-sdk';
import React from 'react';
import ReactDOM from 'react-dom';

import LDApp from './components/App';

const LDWrapper = withLDProvider({
  // eslint-disable-next-line no-undef
  clientSideID: LD_CLIENT_ID,
})(() => <LDApp />);

ReactDOM.render(
  <GoogleOAuthProvider clientId={clientId}>
    <LDWrapper />
  </GoogleOAuthProvider>,
  document.getElementById('app'),
);
