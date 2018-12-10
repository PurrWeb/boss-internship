import React, { Component } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import utils from '~/lib/utils';
import safeMoment from '~/lib/safe-moment';
import classNames from 'classnames';
import Popover from 'react-popover';
import BossWeekPicker from '~/components/react-dates/boss-week-picker';
import FinanceReportsFilter from './finance-reports-filter';
import { appRoutes } from '~/lib/routes';

class Dashboard extends Component {
  state = {
    isCalendarOpen: false,
  };

  togglePopover = () => {
    this.setState({ isCalendarOpen: !this.state.isCalendarOpen });
  };

  renderCalendar() {
    return (
      <div className="boss-popover__inner">
        <BossWeekPicker
          selectionStartUIDate={this.props.startDate}
          onChange={selection => this.props.onDateChange(selection)}
          onCancelClick={this.togglePopover}
        />
      </div>
    );
  }

  render() {
    const { title } = this.props;
    const venueId = oFetch(this.props, 'venueId');
    const date = safeMoment.uiDateParse(oFetch(this.props, 'date'));
    const startDate = safeMoment.uiDateParse(this.props.startDate).format(utils.commonDateFormatCalendar());
    const endDate = safeMoment.uiDateParse(this.props.endDate).format(utils.commonDateFormatCalendar());
    const onFilterChange = oFetch(this.props, 'onFilterChange');
    const filterType = oFetch(this.props, 'filterType');
    const popoverClass = classNames({
      'boss-page-dashboard__meta-item boss-page-dashboard__meta-item_type_faded boss-page-dashboard__meta-item_role_date boss-page-dashboard__meta-item_role_popover': true,
      'boss-page-dashboard__meta-item_state_opened': this.state.isCalendarOpen,
    });
    const showPDFDownloadLink = oFetch(this.props, 'showPDFDownloadLink');
    const canExportToCSV = oFetch(this.props, 'canExportToCSV');

    return (
      <div className="boss-page-main__dashboard">
        <div className="boss-page-main__inner">
          <div className="boss-page-dashboard boss-page-dashboard_updated">
            <div className="boss-page-dashboard__group">
              <h1 className="boss-page-dashboard__title">{title}</h1>
              { (canExportToCSV || showPDFDownloadLink) && <div className="boss-page-dashboard__buttons-group">

                { showPDFDownloadLink && <a href={appRoutes.financeReportsPdfDownload({ date, venueId, filterType })}
                  className="boss-button boss-button_role_download boss-page-dashboard__button" >
                  Download PDF
                </a> }
                { canExportToCSV && <a href={appRoutes.financeReportsCSVExport({ date, venueId, filterType })}
                  className="boss-button boss-button_role_download boss-page-dashboard__button"
                >
                  Export CSV
                </a> }
              </div> }
            </div>
            <div className="boss-page-dashboard__group">
              <div className="boss-page-dashboard__meta">
                <Popover
                  isOpen={this.state.isCalendarOpen}
                  body={this.renderCalendar()}
                  place="below"
                  tipSize={0.01}
                  onOuterAction={this.togglePopover}
                  className="boss-popover boss-popover_context_dashboard-week-picker boss-popover_state_opened"
                  style={{ marginTop: '10px' }}
                >
                  <p className={popoverClass} onClick={this.togglePopover}>
                    <span className="boss-page-dashboard__meta-text">{startDate}</span>
                    {' - '}
                    <span className="boss-page-dashboard__meta-text">{endDate}</span>
                  </p>
                </Popover>
              </div>
              <div className="boss-page-dashboard__controls-group">
                <FinanceReportsFilter onFilterChange={onFilterChange} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  venueId: PropTypes.number.isRequired,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired
};

export default Dashboard;
