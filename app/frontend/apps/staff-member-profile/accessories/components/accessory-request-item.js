import React from 'react';
import oFetch from 'o-fetch';
import safeMoment from '~/lib/safe-moment';
import utils from '~/lib/utils';
import * as constants from './constants';

class AccessoryRequestItem extends React.Component {

  render() {
    const {
      accessoryRequest,
    } = this.props;
    const requestDate = safeMoment.iso8601Parse(oFetch(accessoryRequest, 'createdAt'))
      .format(utils.humanDateFormatWithTime());
    const status = oFetch(accessoryRequest, 'status');
    const accessoryName = oFetch(accessoryRequest, 'accessoryName');
    const size = oFetch(accessoryRequest, 'size');

    return (
      <li className="boss-requests__item">
        <div className="boss-requests__meta">
          <div className="boss-requests__date">{requestDate}</div>
          <div className={`boss-requests__status boss-requests__status_role_${status}`}>{constants.ACCESSORY_REQUEST_STATUS[status]}</div>
        </div>
        <div className="boss-requests__content">
          <div className="boss-requests__header">
            <h3 className="boss-requests__title">
              <span className="boss-requests__title-name">{accessoryName}</span>
              <span className="boss-requests__title-size">{size ? `(${size})` : '(N/A)'}</span>
            </h3>
          </div>
        </div>
      </li>
    )
  }
}

export default AccessoryRequestItem;
