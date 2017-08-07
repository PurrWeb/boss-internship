import React from 'react';
import ReactDOM from 'react-dom';

import {
  NOTIFICATION_CLASSES,
} from '../constants/notifications';

class ChecklistNotification extends React.PureComponent {
  componentDidMount() {
    this.notification = document.createElement('div');
    document.body.insertBefore(this.notification, document.body.firstChild);
    this.renderEditMode(this.props);
  }
  
  componentWillUnmount(){
    ReactDOM.unmountComponentAtNode(this.notification);
    document.body.removeChild(this.notification);
  }

  notificationClass() {
    return NOTIFICATION_CLASSES[this.props.notification.get('status')];
  }

  renderEditMode(props) {
    ReactDOM.render(
      <div className={`boss-alert boss-alert_role_page-note boss-alert_status_success ${this.notificationClass()}`}>
        <p className="boss-alert__text">{this.props.notification.get('message')}</p>
        <button onClick={this.props.onClose} className="boss-alert__button-close"></button>
      </div>,
      this.notification
    );
  }

  render() {
    return null;
  }
}

export default ChecklistNotification;
