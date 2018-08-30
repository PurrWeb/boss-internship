import React from 'react';
import oFetch from 'o-fetch';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import pureToJs from '~/hocs/pure-to-js';
import safeMoment from '~/lib/safe-moment';
import utils from '~/lib/utils';
import humanize from 'string-humanize';
import { PENDING_VALIDATION, VALIDATED } from '../constants';
import { appRoutes } from '~/lib/routes';

class ClientItemMobile extends React.Component {
  render() {
    const [cardNumber, fullName, emailVerified, updatedAt, id] = oFetch(
      this.props.client,
      'cardNumber',
      'fullName',
      'emailVerified',
      'updatedAt',
      'id',
    );
    return (
      <div className="boss-check boss-check_role_board boss-check_page_wtl-clients-index boss-check_highlight_accent-red">
        <div className="boss-check__row">
          <div className="boss-check__cell">
            <h3 className="boss-check__title boss-check__title_role_user">{fullName}</h3>
          </div>
        </div>
        <div className="boss-check__row">
          <div className="boss-check__cell">
            <div
              className={`boss-indicator ${
                emailVerified ? 'boss-indicator_status_success' : 'boss-indicator_status_pending'
              }`}
            >
              <div className="boss-indicator__label">
                {emailVerified ? humanize(VALIDATED) : humanize(PENDING_VALIDATION)}
              </div>
            </div>
          </div>
        </div>
        <div className="boss-check__row boss-check__row_marked">
          <div className="boss-check__info-table">
            <div className="boss-check__info-row">
              <div className="boss-check__info-cell">
                <p className="boss-check__text">Modified at</p>
              </div>
              <div className="boss-check__info-cell">
                <p className="boss-check__text boss-check__text_role_primary">
                  {safeMoment.iso8601Parse(updatedAt).format(utils.commonDateFormatCalendar())}
                </p>
              </div>
            </div>
            <div className="boss-check__info-row">
              <div className="boss-check__info-cell">
                <p className="boss-check__text">Card Number</p>
              </div>
              <div className="boss-check__info-cell">
                <p className="boss-check__text boss-check__text_role_primary">
                  <a href={appRoutes.wtlCardsPage({ cardNumber })} className="boss-check__link">
                    {cardNumber}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="boss-check__row boss-check__row_role_buttons">
          <Link
            to={`/profile/${id}`}
            className="boss-button boss-button_type_small boss-button_role_view-details-light boss-check__button"
          >
            Details
          </Link>
        </div>
      </div>
    );
  }
}

ClientItemMobile.propTypes = {
  client: PropTypes.object.isRequired,
};

export default ClientItemMobile;

export const PureToJSClientItemMobile = pureToJs(ClientItemMobile);
