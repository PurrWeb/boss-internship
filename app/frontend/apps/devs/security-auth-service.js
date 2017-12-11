import axios from 'axios';
import moment from 'moment';
import { debug } from 'util';
import oFetch from 'o-fetch';

const localStorageAccessTokenKey = 'securityAppAccessToken';
const localStorageAccessTokenExpiryKey = 'securityAppAccessTokenExpiresAt';
const localStorageRenewTokenKey = 'securityAppRenewalToken';

const authEndpointAuthTokenKey = 'authToken';
const authEndpointAuthTokenExpiryKey = 'expiresAt';
const authEndpointRenewTokenKey = 'renewToken';

export function authenticateUser({email, password}) {
  return axios.create().post('/api/security-app/v1/sessions/new', {
    username: email,
    password: password,
  }).then(response => {
    localStorage.setItem(localStorageAccessTokenKey, oFetch(response.data, authEndpointAuthTokenKey));
    localStorage.setItem(localStorageAccessTokenExpiryKey, oFetch(response.data, authEndpointAuthTokenExpiryKey));
    localStorage.setItem(localStorageRenewTokenKey, oFetch(response.data, authEndpointRenewTokenKey));

    return Promise.resolve(new SecurityAppAuth);
  });
}

class SecurityAppAuth {
  deauthenticateUser() {
    localStorage.removeItem(localStorageAccessTokenKey);
    localStorage.removeItem(localStorageAccessTokenExpiryKey);
    localStorage.removeItem(localStorageRenewTokenKey);
  }

  static isUserAuthenticated() {
    const token = localStorage.getItem(localStorageAccessTokenKey);

    return token !== null && !SecurityAppAuth.isTokenExpired();
  }

  static isTokenExpired() {
    const expiresAt = localStorage.getItem(localStorageAccessTokenExpiryKey);

    if (expiresAt === null) return false;

    const current = moment();
    const expiration = moment(expiresAt);
    return current >= expiration;
  }

  refreshToken() {
    return new Promise((resolve, reject) => {
      const renewalToken = localStorage.getItem(localStorageRenewTokenKey);

      if (renewalToken === null) {
        throw new Error('Renewal Token not found');
      }

      axios.create().post('/api/security-app/v1/sessions/renew', {
        renewalToken: renewalToken,
      }).then(response => {
        const authToken = oFetch(response.data, authEndpointAuthTokenKey);
        const newRenewalToken = oFetch(response.data, authEndpointRenewTokenKey);
        const expiresAt = oFetch(response.data, authEndpointAuthTokenExpiryKey);

        localStorage.setItem(localStorageAccessTokenKey, authToken);
        localStorage.setItem(localStorageAccessTokenExpiryKey, expiresAt);
        localStorage.setItem(localStorageRenewTokenKey, newRenewalToken);

        return resolve(authToken);
      })
    })
  }

  getToken() {
    return new Promise((resolve, reject) => {
      let token = localStorage.getItem(localStorageAccessTokenKey);

      if (token === null) {
        throw new Error('Token not found');
      }

      if (SecurityAppAuth.isTokenExpired()) {
        this.refreshToken().then(token => {
          return resolve(token);
        });
      } else {
        return resolve(token);
      }
    })
  }
}
