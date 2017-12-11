import React from 'react';
import axios from 'axios';
import AsyncButton from 'react-async-button';
import Highlight from 'react-highlight';
import oFetch from 'o-fetch';
import Auth from '~/lib/security-auth-service';
import AblyService from '~/lib/ably-service';

import {
  initRequest,
} from '../../requests';

export default class PrivatePage extends React.Component {
  state = {
    isLoading: true,
    jsonResponse: {},
    profilePageJSON: {},
    shiftsPageJSON: {},
  }

  componentWillMount() {
    require('highlight.js/styles/vs.css');
  }

  componentDidMount() {
    let authService = oFetch(this.props, 'authService');
    initRequest(authService).then(resp => {
      const ablyData = oFetch(resp.data, 'ablyData');
      const profilePage = oFetch(resp.data, 'profilePage');
      const shiftsPage = oFetch(resp.data, 'shiftsPage');

      this.setState({
        profilePageJSON: profilePage,
        shiftsPageJSON: shiftsPage,
      });

      this.personalChannelName = oFetch(ablyData, 'personalChannelName');
      this.presenceChannelName = oFetch(ablyData, 'presenceChannelName');

      AblyService(authService).then((ably) => {
        const clientId = ably.auth.tokenParams.clientId;
        this.channel_presence = ably.channels.get(oFetch(this, 'presenceChannelName'));
        this.channel_presence.attach((err) => {
          if (err) {}
          this.setState({isLoading: false});
          if (this.personalChannelName) {
            this.client_channel = ably.channels.get(oFetch(this, 'personalChannelName'))
            this.channel_presence.presence.enter(`Enter`, (err) => {
              if (err) { }
            })
            this.client_channel.subscribe((message) => {
              this.setState({jsonResponse: message.data});
            });
          } else {
            this.channel_presence.subscribe((message) => {
              this.setState({jsonResponse: message.data});
            });
          }
        })
      }).catch((err) => {
        console.log(err);
      });
    })
  }

  handleLogout = () => {
    return new Promise((resolve, reject) => {
      this.channel_presence.unsubscribe(oFetch(this, 'presenceChannelName'));
      this.client_channel.unsubscribe(oFetch(this, 'personalChannelName'));
      this.channel_presence.presence.leave((err) => {
        if (err) { return reject('Error') };
        resolve(this.props.onLogOutSuccess());
      });
    });
  }

  render() {
    return (
      <div className="row">
        {this.state.isLoading
          ?
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1>Loading .... </h1>
              </div>
            </div>
          </div>
          :
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-12">
                <div className="form-group float-right">
                  <AsyncButton
                    className="btn btn-primary"
                    text="Log Out"
                    pendingText="Loging Out ..."
                    onClick={this.handleLogout}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 offset-md-4">
                <h1>Data from SSE</h1>
                <Highlight className='json'>
                  {JSON.stringify(this.state.jsonResponse, null, 2)}
                </Highlight>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 offset-md-4">
                <h1>Profile Data</h1>
                <Highlight className='json'>
                  {JSON.stringify(this.state.profilePageJSON, null, 2)}
                </Highlight>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 offset-md-4">
                <h1>Shifts Data</h1>
                <Highlight className='json'>
                  {JSON.stringify(this.state.shiftsPageJSON, null, 2)}
                </Highlight>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}
