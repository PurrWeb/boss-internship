import React from 'react';
import PropTypes from 'prop-types';

class Dashboard extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  }

  render() {
    return (
      <div className="boss-page-main__dashboard">
        <div className="boss-page-main__inner">
          <div className="boss-page-dashboard boss-page-dashboard_updated">
            <div className="boss-page-dashboard__group">
              <h1 className="boss-page-dashboard__title">{this.props.title}</h1>
            </div>
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

export default Dashboard;
