import React from 'react';
import CountDown from './countdown';
import classNames from 'classnames';

export default class NewVersionNotification extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showFull: true,
    }
  }

  reloadPage = () => {
    window.location.reload(true);
  }

  toggleNotification = () => {
    this.setState({showFull: !this.state.showFull});
  }

  render() {
    let notificationCn = classNames("boss-notification", {'boss-notification_state_closed': !this.state.showFull});
    return (
      <div className={notificationCn}>
        <div className="boss-notification__header">
          <p className="boss-notification__text">
            <span className="boss-notification__text-details"> Your app version is out of date. Your app will be refreshed automatically in</span>
            <CountDown countdown={this.props.countdown}/>
            <span className="boss-notification__text-details">minutes</span>
          </p>
          <button onClick={this.toggleNotification} className="boss-notification__switch">Details</button>
        </div>
        <div className="boss-notification__content">
          <p className="boss-notification__text">Or you can refresh app manually, by pressing Refresh Now button below.</p>
          <div className="boss-notification__actions">
            <button onClick={this.reloadPage} className="boss-button boss-notification__action">Refresh Now</button>
          </div>
        </div>
      </div>
    )
  }
}