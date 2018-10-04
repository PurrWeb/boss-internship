import React from 'react';
import { appRoutes } from "~/lib/routes";
import oFetch from 'o-fetch';
import safeMoment from "~/lib/safe-moment";
import BossDatePicker from '~/components/react-dates/boss-date-picker';

class DailyReportsDashboard extends React.Component {
  render() {
    let venueId = oFetch(this.props, 'venueId');
    let venueName = oFetch(this.props, 'venueName');
    let dateM = oFetch(this.props, 'dateM');
    let weekStartDateM = oFetch(this.props, 'weekStartDateM');

    return <div className="boss-page-main__dashboard">
      <div className="boss-page-main__inner">
        <div className="boss-page-dashboard boss-page-dashboard_updated boss-page-dashboard_page_daily-reports">
          <div className="boss-page-dashboard__group">
            <div className="boss-page-dashboard__sub-group">
              <h1 className="boss-page-dashboard__title">
                <span className="boss-page-dashboard__title-text">Daily reports for&nbsp;</span>
                <span className="boss-page-dashboard__title-text boss-page-dashboard__title-text_marked">{ venueName }&nbsp;</span>
                <span className="boss-page-dashboard__title-text boss-page-dashboard__title-text_marked">{ dateM.format('DD MMM YYYY') }</span>
              </h1>
              <div className="boss-page-dashboard__controls-group">
                <form className="boss-form">
                  <div className="boss-form__row boss-form__row_justify_space boss-form__row_position_last">
                    <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_min boss-form__field_position_last">
                      <BossDatePicker 
                        id="date"
                        date={dateM}
                        onApply={(date) => {
                          window.location.href = appRoutes.dailyReportsPage({
                            venueId: venueId,
                            dateM: date
                          })
                        }}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="boss-page-dashboard__buttons-group">
              <a href={appRoutes.weeklyReportsPage({
                venueId: venueId,
                weekStartDateM: weekStartDateM
              })} className="boss-button boss-button_role_secondary boss-page-dashboard__button">View weekly report</a>
              <a href={appRoutes.dailyReportsPDFDownload({
                venueId: venueId,
                dateM: dateM
              })} className="boss-button boss-button_role_download boss-page-dashboard__button">Download PDF</a>
            </div>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default DailyReportsDashboard;