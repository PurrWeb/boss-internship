import React from 'react';
import LoginForm from './components/login-form';
import PrivatePage from './components/private-page';
import oFetch from 'o-fetch';
import {authenticateUser} from './security-auth-service';

export default class Devs extends React.Component {
  state = {
    authService: null
  }

  componentWillMount() {
    require('bootstrap/dist/css/bootstrap.css');
  }

  handleSignInSuccess = ({email, password}) => {
    return authenticateUser({email, password}).then(authService => {
      this.setState({
        authService: authService,
      });
    });
  }

  handleLogOutSuccess = () => {
    return new Promise((resolve, reject) => {
      this.state.authService.deauthenticateUser();
      this.setState({isUserAuthenticated: false, authService: undefined }, () => resolve());
    });
  }

  authenticated() {
    return !!this.state.authService
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            {!this.authenticated() && <LoginForm
              onSignInSuccess={this.handleSignInSuccess}
            />}
            {this.authenticated() && <PrivatePage
              authService={oFetch(this.state, 'authService')}
              onLogOutSuccess={this.handleLogOutSuccess}
            />}
          </div>
        </div>
      </div>
    )
  }
}
