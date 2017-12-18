import React from 'react';
import PropTypes from 'prop-types';

import DashboardFilter from './dashboard-filter';
import DashboardActions from './dashboard-actions';

class SimpleDashboard extends React.Component {

  parseChildrens = () => {
    React.Children.map(this.props.children, (child, i) => {
      if (child.type === DashboardFilter) {
        this.filter = child;
      };
      if (child.type === DashboardActions) {
        this.actions = child;
      };
      return;
    })
  }

  componentWillMount() {
    this.parseChildrens();
  }

  render() {
    return (
      <div className="boss-page-main__dashboard">
        <div className="boss-page-main__inner">
          <div className="boss-page-dashboard boss-page-dashboard_updated">
            <div className="boss-page-dashboard__group">
              <div className="boss-page-dashboard__sub-group">
                <h1 className="boss-page-dashboard__title">{this.props.title}</h1>
              </div>
              {this.actions}
            </div>
            {this.filter}
          </div>
        </div>
      </div>
    )
  }
}

SimpleDashboard.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  children: PropTypes.array,
}

SimpleDashboard.defaultProps = {
  className: ''
}

export default SimpleDashboard;
