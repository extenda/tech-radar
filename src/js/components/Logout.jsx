import React from 'react';
import { googleLogout } from '@react-oauth/google';
import Icon from './Icon';

const logout = () => {
  googleLogout();
  window.setTimeout(() => {
    window.location.reload();
  }, 100);
};

const Logout = () => (
  <button type="button" className="google-button signout" onClick={logout}>
    <Icon name="sign-out" />
    Sign out
  </button>
);

export default Logout;
