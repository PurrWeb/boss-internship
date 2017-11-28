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

  handleSignInSuccess = ({token, ablyToken, presenceChannel, personalChannel}) => {
    return new Promise((resolve, reject) => {
      this.presenceChannel = presenceChannel;
      this.personalChannel = personalChannel;

      this.ably = new Ably.Realtime({authUrl: '/api/security_app/v1/sessions/ably_auth', authHeaders: {
        Authorization: `Token token="${token}"`
      }});

      this.ably.connection.once('failed', () => {
        reject('Connection failed');
      });
      
      this.ably.connection.once('connected', () => {
        const clientId = this.ably.auth.tokenParams.clientId;
        this.channel_presence = this.ably.channels.get(this.presenceChannel);

        this.channel_presence.attach((err) => {
          if (err) {return reject('Error attaching to the channel')}
          if (this.personalChannel) {
            this.client_channel = this.ably.channels.get(this.personalChannel)
            this.channel_presence.presence.enter(`Enter`, (err) => {
              if (err) { return reject('Error presenting the channel')}
              this.setState({loggedIn: true}, () => resolve());
            })
            this.client_channel.subscribe((message) => {
              this.setState({jsonResponse: message.data});
            });
          } else {
            this.channel_presence.subscribe((message) => {
              this.setState({jsonResponse: message.data});
            });
            this.setState({loggedIn: true}, () => resolve());
          }
        })
      });
    })
  }

  handleLogOutSuccess = () => {
    return new Promise((resolve, reject) => {
      this.channel_presence.unsubscribe(this.presenceChannel);
      this.client_channel.unsubscribe(this.personalChannel);
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
