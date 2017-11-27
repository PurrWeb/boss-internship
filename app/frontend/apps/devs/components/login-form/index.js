import React from 'react';
import AsyncButton from 'react-async-button';

import {
  signInRequest,
} from './requests';

export default class LoginForm extends React.Component {
  state = {
    email: '',
    password: '',
  }

  handleSignIn = () => {
    return signInRequest(this.state.email, this.state.password).then(resp => {
      return this.props.onSignInSuccess({token: resp.headers.token}).catch(error => {
        alert(error);
      })
    }).catch(resp => {
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
            <h1 className="display-3">Please sign in</h1>
            <form>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input value={this.state.email} onChange={this.handleEmailChange} type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" />
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input value={this.state.password} onChange={this.handlePasswordChange} type="password" className="form-control" id="password" placeholder="Password" />
              </div>
              <div className="form-check">
                <label className="form-check-label">
                  <input type="checkbox" className="form-check-input" />
                  Check me out
                </label>
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
