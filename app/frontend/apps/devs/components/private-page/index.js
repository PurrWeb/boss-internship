import React from 'react';
import AsyncButton from 'react-async-button';
import Highlight from 'react-highlight';
import oFetch from 'o-fetch';
import Auth from '../../security-auth-service';
import globalNotification from '~/components/global-notification';
import {ablyErrorCodes, createAblyService} from '../../ably-service';

import {
  initRequest,
  sendTestRequest,
} from '../../requests';

export default class PrivatePage extends React.Component {
  state = {
    isLoading: true,
    jsonResponse: {},
    profilePageJSON: {},
    shiftsPageJSON: {}
  }

  componentWillMount() {
    require('highlight.js/styles/vs.css');
  }

  displayAblyConnectedNotification(resp){
    globalNotification('Connected to Ably', {
      interval: 5000,
      status: 'success'
    });
  }

  displayAblyDisconnectedNotification(resp){
    let message = 'Ably connection disconnected. Reason: ' + oFetch(ablyErrorCodes, resp.reason.code);
    globalNotification(message, {
      interval: 5000,
      status: 'error'
    });
  }

  displayAblyConnectionFailedNotification(resp){
    let message = 'Ably connection failed. Reason: ' + oFetch(ablyErrorCodes, resp.reason.code);

    globalNotification(message, {
      interval: 5000,
      status: 'error'
    });
  }

  displayAblyTokenObtainedNotification(){
    globalNotification('Ably Token obtained successfully', {
      interval: 5000,
      status: 'success'
    });
  }

  onRenewTokenFailed = (error) => {
    const { status } = error.response
    globalNotification(`Renew token failed, status: ${status}`, {
      interval: 5000,
      status: 'error'
    });

    this.handleLogout();
  }

  componentDidMount(){
    let authService = oFetch(this.props, 'authService');
    initRequest(authService).then(resp => {
      const ablyData = oFetch(resp.data, 'ablyData');
      const profilePage = oFetch(resp.data, 'profilePage');
      const shiftsPage = oFetch(resp.data, 'shiftsPage');

      this.setState({
        profilePageJSON: profilePage,
        shiftsPageJSON: shiftsPage,
      });

      const personalChannelName = oFetch(ablyData, 'personalChannelName');
      const presenceChannelName = oFetch(ablyData, 'presenceChannelName');

      createAblyService({
        authService: authService,
        onTokenObtained: this.displayAblyTokenObtainedNotification,
        onConnected: this.displayAblyConnectedNotification,
        onDisconnected: this.displayAblyDisconnectedNotification,
        onFailed: this.displayAblyConnectionFailedNotification,
        personalChannelName: personalChannelName,
        presenceChannelName: presenceChannelName,
        onRenewTokenFailed: this.onRenewTokenFailed
      }).then((ablyService) => {
        this.ablyService = ablyService;
        ablyService.subscribeToPersonalChannel((message) => {
          this.setState({jsonResponse: message.data});
        });

        this.setState({isLoading: false});
      });
    });
  }

  handleLogout = () => {
    return this.ablyService.deactivate().then(() => {
      this.props.onLogOutSuccess();
    });
  }

  onTestClick = () => {
    sendTestRequest(oFetch(this.props, 'authService'));
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
                <button
                  onClick={this.onTestClick}
                  className="btn btn-primary"
                >Send Api Test Request</button>
              </div>
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
