import { GoogleLogin } from '@react-oauth/google';
import { hostedDomain } from '@tech-radar/shared/src/auth-config';
import PropTypes from 'prop-types';
import React from 'react';

const Login = (props) => {
  const { onSuccess, onFailure } = props;
  return (
    <>
      <nav className="navbar" role="navigation">
        <ul className="breadcrumb">
          <li key="home">&nbsp;</li>
        </ul>
      </nav>
      <div className="container">
        <h1 className="center">Extenda Retail Tech Radar</h1>
        <div className="row">
          <div className="two columns">&nbsp;</div>
          <div className="five columns">
            <p>
              <span role="img" aria-label="Wave">
                &#x1F44B;
              </span>
              &nbsp; Welcome to the Extenda Retail Tech Radar. Login with your Extenda Retail Google
              account.
            </p>
          </div>
          <div className="three columns">
            <GoogleLogin
              className="google-button"
              onSuccess={onSuccess}
              onFailure={onFailure}
              theme="outline"
              hosted_domain={hostedDomain}
            />
          </div>
          <div className="two columns">&nbsp;</div>
        </div>
      </div>
    </>
  );
};

Login.propTypes = {
  onSuccess: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
};

export default Login;
