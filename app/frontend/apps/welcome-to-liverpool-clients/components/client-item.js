import React from 'react';
import oFetch from 'o-fetch';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import humanize from 'string-humanize';
import pureToJs from '~/hocs/pure-to-js';
import { VALIDATED, PENDING_VALIDATION } from '../constants';
import { appRoutes } from '~/lib/routes';

class ClientItem extends React.Component {
  render() {
    const [cardNumber, fullName, emailVerified, id] = oFetch(
      this.props.client,
      'cardNumber',
      'fullName',
      'emailVerified',
      'id',
    );
    return (
      <div className="boss-table__row">
        <div className="boss-table__cell">
          <div className="boss-table__info">
            <p className="boss-table__text">{fullName}</p>
          </div>
        </div>
        <div className="boss-table__cell">
          <div className="boss-table__info">
            <p
              className={`boss-table__text ${
                emailVerified ? 'boss-table__text_role_success-status' : 'boss-table__text_role_pending-status'
              }`}
            >
              {emailVerified ? humanize(VALIDATED) : humanize(PENDING_VALIDATION)}
            </p>
          </div>
        </div>
        <div className="boss-table__cell">
          <div className="boss-table__info">
            <p className="boss-table__text">
              <a href={appRoutes.wtlCardsPage({ cardNumber })} className="boss-table__link">
                {cardNumber}
              </a>
            </p>
          </div>
        </div>
        <div className="boss-table__cell">
          <div className="boss-table__info">
            <div className="boss-table__actions">
              <Link
                to={`/profile/${id}`}
                className="boss-button boss-button_type_small boss-button_role_view-details-light boss-table__action"
              >
                Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ClientItem.propTypes = {
  client: PropTypes.object.isRequired,
};

export default ClientItem;

export const PureToJSClientItem = pureToJs(ClientItem);
