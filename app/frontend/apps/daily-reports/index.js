import oFetch from 'o-fetch';
import safeMoment from "~/lib/safe-moment";
import React from 'react';
import DailyReports from './containers/daily-reports';

class DailyReportsApp extends React.Component {
  render(){
    return <DailyReports
      venueId={ oFetch(this.props, 'venueId') }
      venueName={ oFetch(this.props, 'venueName')}
      dateM={ safeMoment.uiDateParse(oFetch(this.props, 'date')) }
      weekStartDateM={ safeMoment.uiDateParse(oFetch(this.props, 'weekStartDate')) }
      dailyReport={ oFetch(this.props, 'dailyReport') }
  />;
  }
}

export default DailyReportsApp;
