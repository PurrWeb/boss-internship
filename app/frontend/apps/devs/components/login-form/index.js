import React from 'react';
import AsyncButton from 'react-async-button';
import oFetch from 'o-fetch';

import {
  signInRequest,
  initRequest
} from './requests';

export default class LoginForm extends React.Component {
  state = {
    email: '',
    password: ''
  }

  handleSignIn = () => {
    return signInRequest(this.state.email, this.state.password).then(resp => {
      let token = oFetch(resp.data, 'token');
      let expiresAt = oFetch(resp.data, 'expiresAt');

      return initRequest(token).then(resp => {
        let ablyData = oFetch(resp.data, 'ablyData');
        let personalChannelName = oFetch(ablyData, 'personalChannelName');
        let presenceChannelName = oFetch(ablyData, 'presenceChannelName');

        this.props.onSignInSuccess({
          token: token,
          tokenExpiresAt: expiresAt,
          personalChannelName: personalChannelName,
          presenceChannelName: presenceChannelName
        });
      });
    }).catch(resp => {
      console.log(resp);
      const errors = resp.response.data.errors;
      if (errors) {
        if (errors.base) {
          alert(errors.base[0])
        }
      }
    })
  }

  handleEmailChange = (e) => {
    this.setState({email: e.target.value})
  }

  handlePasswordChange = (e) => {
    this.setState({password: e.target.value})
  }

  render() {
    return(
      <div className="row">
        <div className="offset-md-4 col-md-6">
          <div className="jumbotron">
            <h1 className="display-3">Security App SSE Test </h1>
            <form>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input value={this.state.email} onChange={this.handleEmailChange} type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input value={this.state.password} onChange={this.handlePasswordChange} type="password" className="form-control" id="password" placeholder="Password" />
              </div>
              <AsyncButton
                className="btn btn-primary"
                text="Sign In"
                pendingText="Signing In ..."
                onClick={this.handleSignIn}
              />
            </form>
          </div>
        </div>
      </div>
    )
  }
}
