import React from 'react';

import MainDashboard from './components/main-dashboard';
import MainContent from './components/main-content';

export default class VenueDashboardApp extends React.Component {
  render() {
    console.log(this.props);
    return (
      <main className="boss-page-main">
        <MainDashboard {...this.props} />
        <MainContent {...this.props} />
      </main>
    );
  }
}
