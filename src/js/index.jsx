import React from 'react';
import ReactDOM from 'react-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { withLDProvider } from 'launchdarkly-react-client-sdk';
import LDApp from './components/App';
import { clientId } from './modules/auth-config';
import '../assets/favicon.ico';
import '../assets/css/main.css';

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
