import React from 'react';
import AsyncButton from 'react-async-button';
import oFetch from 'o-fetch';

import {
  signInRequest,
  initRequest
} from '../../requests';

export default class LoginForm extends React.Component {
  state = {
    email: '',
    password: ''
  }

  handleSignIn = () => {
    return this.props.onSignInSuccess({email: this.state.email, password: this.state.password})
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
