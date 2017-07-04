import React from 'react';
import AppVersion from "~app-version";
import NewVersionNotification from './new-version-notification';

export default class AppVersionChecker extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isNewVersionExist: false
    }
    const appVersion = new AppVersion({interval: this.props.checkEvery});
    appVersion.checkVersionEvery((err, hasNewVersion) => {
      if (err) {
        throw Error(err);
      }
      this.setState({isNewVersionExist: hasNewVersion});
    })
  }

  render() {
    return (
      <div>
        { this.state.isNewVersionExist && <NewVersionNotification countdown={this.props.countdown} /> }
      </div>
    )
  }
}