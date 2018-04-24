import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import moment from 'moment';
import utils from '~/lib/utils';

class AssignDashboard extends PureComponent {

  render() {
    const shiftRequest = oFetch(this.props, 'shiftRequest');
    const title = oFetch(this.props, 'title');
    const startsAt = oFetch(shiftRequest, 'startsAt');
    const endsAt = oFetch(shiftRequest, 'endsAt');
    const venueName = oFetch(shiftRequest, 'venueName');
    return (
      <div className="boss-page-main__dashboard">
        <div className="boss-page-main__inner">
          <div className="boss-page-dashboard boss-page-dashboard_updated">
            <div className="boss-page-dashboard__group">
              <h1 className="boss-page-dashboard__title">{title}</h1>
            </div>

            <div className="boss-page-dashboard__group">
              <div className="boss-page-dashboard__meta">
                <p className="boss-page-dashboard__meta-item boss-page-dashboard__meta-item_role_subtitle boss-page-dashboard__meta-item_role_time">
                  <span className="boss-page-dashboard__meta-text">
                    {`${moment(startsAt).format(utils.commonDateFormatTimeOnly())} - ${moment(
                      endsAt,
                    ).format(utils.humanDateFormatWithDayOfWeek())}`}
                  </span>
                </p>
                <p className="boss-page-dashboard__meta-item boss-page-dashboard__meta-item_role_subtitle boss-page-dashboard__meta-item_role_venue">
                  <span className="boss-page-dashboard__meta-text">
                    {venueName}
                  </span>
                </p>
              </div>
              <div className="boss-page-dashboard__buttons-group boss-page-dashboard__buttons-group_position_last">
                {this.props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AssignDashboard.propTypes = {
  title: PropTypes.string.isRequired,
  shiftRequest: PropTypes.shape({
    startsAt: PropTypes.string.isRequired,
    endsAt: PropTypes.string.isRequired,
    venueId: PropTypes.number.isRequired,
    venueName: PropTypes.string.isRequired,
  }),
};

export default AssignDashboard;
