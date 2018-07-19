import React from 'react';
import PropTypes from 'prop-types';

import DashboardActions from '~/components/boss-dashboards/dashboard-actions';

function isFunction(functionToCheck) {
  return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

class SimpleDashboard extends React.Component {
  parseChildrens = () => {
    React.Children.map(this.props.children, (child, i) => {
      if (child.type === DashboardActions) {
        this.actions = React.cloneElement(child);
      }
      return;
    });
  };

  renderFilter() {
    if (!this.props.filterRenderer) {
      return null;
    } else {
      return React.cloneElement(this.props.filterRenderer());
    }
  }

  render() {
    this.parseChildrens();

    return (
      <div className="boss-page-main__dashboard">
        <div className="boss-page-main__inner">
          <div className="boss-page-dashboard boss-page-dashboard_updated">
            <div className="boss-page-dashboard__group">
              <div className="boss-page-dashboard__sub-group">
                {isFunction(this.props.title) ? (
                  this.props.title()
                ) : (
                  <h1 className="boss-page-dashboard__title">{this.props.title}</h1>
                )}
              </div>
              {this.actions}
            </div>
            {this.renderFilter()}
          </div>
        </div>
      </div>
    );
  }
}

SimpleDashboard.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
};

SimpleDashboard.defaultProps = {
  className: '',
};

export default SimpleDashboard;
