import axios from 'axios';
import moment from 'moment';
import { debug } from 'util';
import oFetch from 'o-fetch';
import http from '~/apps/devs/request-api';

export async function authenticateUser({email, password}) {
  const apiInstance = await http();
  const response = await apiInstance.post('/api/security-app/v1/sessions/new', {
    username: email,
    password: password,
  });

  localStorage.setItem('securityAppAccessToken', oFetch(response.data, 'token'));
  localStorage.setItem('securityAppExpiresAt', oFetch(response.data, 'expiresAt'));

  return new SecurityAppAuth;
}

class SecurityAppAuth {
  deauthenticateUser() {
    localStorage.removeItem('securityAppAccessToken');
    localStorage.removeItem('securityAppExpiresAt');
  }

  static isUserAuthenticated() {
    const token = localStorage.getItem('securityAppAccessToken');

    return token !== null && !SecurityAppAuth.isTokenExpired(expiresAt);
  }

  static isTokenExpired() {
    const expiresAt = localStorage.getItem('securityAppExpiresAt');

    if (expiresAt === null) return false;

    const current = moment();
    const expiration = moment(expiresAt);
    return current >= expiration;
  }

  // ToDo: Needs create endpoint and logic
  async renewToken() {
    let renewalToken = localStorage.getItem('securityAppAccessToken');

    const response = await http.post('/api/security-app/v1/sessions/refresh-token', {
      renewalToken: renewalToken,
    });

    const token = oFetch(response.data, 'token');
    const newRenewalToken = oFetch(response.data, 'renewalToken');
    const expiresAt = oFetch(response.data, 'expiresAt');

    localStorage.setItem('securityAppAccessToken', token);
    localStorage.setItem('securityAppExpiresAt', expiresAt);
    localStorage.setItem('securityAppRenewalToken', newRenewalToken);

    return token;
  }

  async getToken() {
    let token = localStorage.getItem('securityAppAccessToken');

    if (token === null) {
      // What we need to do ???
      // Redirect to sign in page ???
      // From here ?
    }

    if (SecurityAppAuth.isTokenExpired()) {
      token = await refreshToken();
    }

    return token;
  }
}
