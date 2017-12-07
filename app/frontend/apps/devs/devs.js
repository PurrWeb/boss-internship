import React from 'react';
import LoginForm from './components/login-form';
import LoggedInPage from './components/logged-in-page';
import oFetch from 'o-fetch';
const Ably = require('ably/browser/static/ably-commonjs.js');

export default class Devs extends React.Component {
  state = {
    loggedIn: false,
    presenceChannelName: null,
    personalChannelName: null,
    apiToken: null,
    jsonResponse: {}
  }

  componentWillMount() {
    require('bootstrap/dist/css/bootstrap.css');
  }

  handleSignInSuccess = (data) => {
    let token = oFetch(data, 'token');
    let personalChannelName = oFetch(data, 'personalChannelName');
    let presenceChannelName = oFetch(data, 'presenceChannelName');

    let newState = {
      loggedIn: false,
      presenceChannelName: personalChannelName,
      personalChannelName: personalChannelName,
      apiToken: token,
      jsonResponse: {}
    }

    return this.setState(newState, () => {
      this.performAblyCalls()
    });
  }

  performAblyCalls(){
    new Promise((resolve, reject) => {
      this.ably = new Ably.Realtime({authUrl: '/api/security-app/v1/sessions/ably-auth', authHeaders: {
        Authorization: `Token token="${oFetch(this.state, 'apiToken')}"`
      }});

      this.ably.connection.once('failed', () => {
        reject('Connection failed');
      });

      this.ably.connection.once('connected', () => {
        const clientId = this.ably.auth.tokenParams.clientId;
        this.channel_presence = this.ably.channels.get(oFetch(this.state, 'presenceChannelName'));

        this.channel_presence.attach((err) => {
          if (err) {return reject('Error attaching to the channel')}
          if (this.personalChannelName) {
            this.client_channel = this.ably.channels.get(oFetch(this.state, 'personalChannelName'))
            this.channel_presence.presence.enter(`Enter`, (err) => {
              if (err) { return reject('Error presenting the channel')}

              this.setState({ loggedIn: true }, () => resolve());
            })
            this.client_channel.subscribe((message) => {
              this.setState({jsonResponse: message.data});
            });
          } else {
            this.channel_presence.subscribe((message) => {
              this.setState({jsonResponse: message.data});
            });

            this.setState({ loggedIn: true }, () => resolve());
          }
        })
      });
    })
  }

  handleLogOutSuccess = ({token}) => {
    return new Promise((resolve, reject) => {
      this.channel_presence.unsubscribe(oFetch(this.state, 'presenceChannelName'));
      this.client_channel.unsubscribe(oFetch(this.state, 'personalChannelName'));
      this.channel_presence.presence.leave((err) => {
        if (err) { return reject('Error') };
        this.setState({
          loggedIn: false,
          jsonResponse: {}
        });
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
            {this.state.loggedIn && <LoggedInPage jsonResponse={oFetch(this.state, 'jsonResponse')} onLogOutSuccess={this.handleLogOutSuccess} />}
          </div>
        </div>
      </div>
    )
  }
}
