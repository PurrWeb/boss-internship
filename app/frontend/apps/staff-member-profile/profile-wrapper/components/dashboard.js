import React from 'react';

const Dashboard = ({children}) => {
  return (
    <div className="boss-page-dashboard boss-page-dashboard_updated boss-page-dashboard_page_profile">
      <div className="boss-page-dashboard__group">
        {children}
      </div>
    </div>
  );
}

export default Dashboard;
