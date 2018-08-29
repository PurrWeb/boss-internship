import React from 'react';
import PropTypes from 'prop-types';

import DashboardFilter from './dashboard-filter';
import DashboardActions from './dashboard-actions';

function isFunction(functionToCheck) {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
  );
}

class SimpleDashboard extends React.Component {
  parseChildrens = () => {
    React.Children.map(this.props.children, (child, i) => {
      if (child.type === DashboardFilter) {
        this.filter = React.cloneElement(child);
      }
      if (child.type === DashboardActions) {
        this.actions = React.cloneElement(child);
      }
      return;
    });
  };

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
                  <h1 className="boss-page-dashboard__title">
                    {this.props.title}
                  </h1>
                )}
              </div>
              {this.actions}
            </div>
            {this.filter}
          </div>
        </div>
      </div>
    );
  }
}

SimpleDashboard.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.element,
  ]).isRequired,
  className: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.element]),
};

SimpleDashboard.defaultProps = {
  className: '',
};

export default SimpleDashboard;
