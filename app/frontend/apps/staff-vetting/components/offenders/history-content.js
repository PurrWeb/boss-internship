import React, { Component } from 'react';
import oFetch from 'o-fetch';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import safeMoment from '~/lib/safe-moment';
import utils from '~/lib/utils';

momentDurationFormatSetup(moment);

export default class OffenderHistoryModalContent extends Component {
  render() {
    const [history, onHistoryDetailsClick, onClose] = oFetch(this.props, 'history', 'onHistoryDetailsClick', 'onClose');
    return (
      <div className="boss-modal-window__overview">
        <div className="boss-overview">
          <div className="boss-overview__group">
            <ul className="boss-overview__activity">
              {history.map((item, index) => {
                const [dodgedMinutes, weekStart] = oFetch(item, 'dodgedMinutes', 'weekStart');
                const formattedDate = safeMoment.uiDateParse(weekStart).format(utils.commonDateFormatWithDay());
                const formattedTime = moment
                  .duration(dodgedMinutes, 'minutes')
                  .format('*h[h] m[m]', { trim: 'both', useGrouping: false });
                return (
                  <li key={index} className="boss-overview__activity-item">
                    <p className="boss-overview__text">
                      {formattedDate} - <span className="boss-overview__text-marked">{formattedTime}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        onHistoryDetailsClick(weekStart);
                        onClose();
                      }}
                      className="boss-overview__link boss-overview__link_role_details"
                    >
                      Details
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
