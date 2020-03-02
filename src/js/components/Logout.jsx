import React from 'react';
import { GoogleLogout } from 'react-google-login';
import Icon from './Icon';
import { clientId } from '../modules/auth-config';

const signOutButton = (renderProps) => {
  const { onClick } = renderProps;
  return (
    <button type="button" className="google-button signout" onClick={onClick}>
      <Icon name="sign-out" />
      Sign out
    </button>
  );
};

const logoutDidSucceed = () => {
  window.location.reload();
};

const Logout = () => (
  <GoogleLogout
    clientId={clientId}
    onLogoutSuccess={logoutDidSucceed}
    render={signOutButton}
  />
);

export default Logout;
