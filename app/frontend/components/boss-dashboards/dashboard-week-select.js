import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Popover from 'react-popover';
import safeMoment from '~/lib/safe-moment';
import BossWeekPicker from '~/components/react-dates/boss-week-picker';
import utils from '~/lib/utils';

class DashboardWeekSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCalendarOpen: false,
    };
  }

  togglePopover = () => {
    this.setState({ isCalendarOpen: !this.state.isCalendarOpen });
  };

  render() {
    const startDate = safeMoment.uiDateParse(this.props.startDate).format(utils.commonDateFormatCalendar());
    const endDate = safeMoment.uiDateParse(this.props.endDate).format(utils.commonDateFormatCalendar());

    const popoverClass = classNames({
      'boss-page-dashboard__meta-item boss-page-dashboard__meta-item_type_faded boss-page-dashboard__meta-item_role_date boss-page-dashboard__meta-item_role_popover': true,
      'boss-page-dashboard__meta-item_state_opened': this.state.isCalendarOpen,
    });
    return (
      <div className="boss-page-main__dashboard">
        <div className="boss-page-main__inner">
          <div className="boss-page-dashboard boss-page-dashboard_updated">
            <div className="boss-page-dashboard__group">
              <h1 className="boss-page-dashboard__title">{this.props.title}</h1>
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
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
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
}

DashboardWeekSelect.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
  startDate: PropTypes.string.isRequired,
  endDate: PropTypes.string.isRequired,
  onDateChange: PropTypes.func.isRequired,
};

DashboardWeekSelect.defaultProps = {
  className: '',
};

export default DashboardWeekSelect;
