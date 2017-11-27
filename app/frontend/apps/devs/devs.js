import React from 'react';
import LoginForm from './components/login-form';
import LoggedInPage from './components/logged-in-page';
const Ably = require('ably/browser/static/ably-commonjs.js');

export default class Devs extends React.Component {
  state = {
    loggedIn: false,
    jsonResponse: {}
  }
  
  componentWillMount() {
    require('bootstrap/dist/css/bootstrap.css');
  }

  handleSignInSuccess = ({token}) => {
    return new Promise((resolve, reject) => {
      this.ably = new Ably.Realtime({authUrl: '/api/security_app/v1/sessions/ably_auth', authHeaders: {
        Authorization: `Token token="${token}"`
      }});

      this.ably.connection.once('failed', () => {
        reject('Connection failed');
      });
      
      this.ably.connection.once('connected', () => {
        window.accessToken = token;

        const clientId = this.ably.auth.tokenParams.clientId;
        this.channel_presence = this.ably.channels.get(`security-app-presence`);
        this.client_channel = this.ably.channels.get(`security-app-${clientId}`)
        this.channel_presence.attach((err) => {
          if (err) {return reject('Error attaching to the channel')}
          this.channel_presence.presence.enter(`Enter`, (err) => {
            if (err) { return reject('Error presenting the channel')}
            this.setState({loggedIn: true});
            resolve();
          })
          this.client_channel.subscribe((message) => {
            console.log(message.data);
            this.setState({jsonResponse: message.data});
          });
        })
      });
    })
  }

  handleLogOutSuccess = () => {
    return new Promise((resolve, reject) => {
      this.channel_presence.unsubscribe(`security-app-presence`);
      this.client_channel.unsubscribe(`security-app-${this.ably.auth.tokenParams.clientId}`);
      this.channel_presence.presence.leave((err) => {
        if (err) { return reject('Error') };
        this.setState({loggedIn: false, jsonResponse: {}});
        window.accessToken = null;
        resolve();
      });
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            {!this.state.loggedIn && <LoginForm
              onSignInSuccess={this.handleSignInSuccess}
            />}
            {this.state.loggedIn && <LoggedInPage jsonResponse={this.state.jsonResponse} onLogOutSuccess={this.handleLogOutSuccess} />}
          </div>
        </div>
      </div>
    )
  }
}
