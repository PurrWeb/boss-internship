import React, { Component } from 'react';
import oFetch from 'o-fetch';
import safeMoment from '~/lib/safe-moment';
import utils from '~/lib/utils';

export default class OffenderReviewHistoryModalContent extends Component {
  render() {
    const reviewHistory = oFetch(this.props, 'reviewHistory');

    return (
      <div className="boss-modal-window__overview">
        <div className="boss-overview">
          <div className="boss-overview__group">
            <ul className="boss-overview__activity">
              {reviewHistory.map((item, index) => {
                const [reviewedBy, reviewedAt, note] = oFetch(item, 'reviewedBy', 'reviewedAt', 'note');
                const formattedDate = safeMoment.iso8601Parse(reviewedAt).format(utils.humanDateFormatWithTime());

                return (
                  <li key={index} className="boss-overview__activity-item">
                    <p className="boss-overview__text">
                      <span className="boss-overview__text-marked">{formattedDate} </span>
                      <span className="boss-overview__text-faded">reviewed by </span>
                      <span className="boss-overview__text-marked">{reviewedBy} </span>
                    </p>
                    <div className="boss-overview__box boss-overview__box_position_below">
                      <p className="boss-overview__text">{note}</p>
                    </div>
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
