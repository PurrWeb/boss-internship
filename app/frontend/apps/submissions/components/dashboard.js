import React from 'react';
import PropTypes from 'prop-types';

const Dashboard = ({title, children}) => {
  return (
    <div className="boss-page-main__dashboard">
      <div className="boss-page-main__inner">
        <div className="boss-page-dashboard boss-page-dashboard_updated">
          <h1 className="boss-page-dashboard__title">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Dashboard;
