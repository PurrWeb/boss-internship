import React from 'react';

import RotaDailyDashboard from '../components/rota-daily-dashboard';
import RotaDailyContent from '../components/rota-daily-content';
import RotaDailyMobileFilter from '../components/rota-daily-mobile-filter';

class RotaDaily extends React.Component {
  render() {
    return (
      <div>
        <RotaDailyMobileFilter />
        <RotaDailyDashboard />
        <RotaDailyContent />
      </div>
    )
  }
}

export default RotaDaily;
