import React from 'react';
import oFetch from 'o-fetch';
import PropTypes from 'prop-types';
import humanize from 'string-humanize';
import AsyncButton from 'react-async-button';
import pureToJs from '~/hocs/pure-to-js';
import { PENDING_VALIDATION, VALIDATED } from '../constants';
import { appRoutes } from '~/lib/routes';
import { openWarningModal } from '~/components/modals';

class ProfileCard extends React.PureComponent {
  handleDisable = () => {
    const [disableClientRequested, id] = oFetch(this.props, 'disableClientRequested', 'client.id');
    openWarningModal({
      submit: hideModal => disableClientRequested({ id }).then(hideModal),
      config: {
        title: 'WARNING !!!',
        text: 'Are You Sure?',
        buttonText: 'Disable',
      },
    });
  };

  render() {
    const [id, cardNumber, fullName, emailVerified, gender, dateOfBirth, email, university, disabled] = oFetch(
      this.props.client,
      'id',
      'cardNumber',
      'fullName',
      'emailVerified',
      'gender',
      'dateOfBirth',
      'email',
      'university',
      'disabled',
    );
    const [enableClientRequested, history] = oFetch(this.props, 'enableClientRequested', 'history');
    return (
      <div className="boss-check boss-check_role_board boss-check_page_wtl-clients-profile">
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
                <p className="boss-check__text">Gender</p>
              </div>
              <div className="boss-check__info-cell">
                <p className="boss-check__text boss-check__text_role_primary">{gender}</p>
              </div>
            </div>
            <div className="boss-check__info-row">
              <div className="boss-check__info-cell">
                <p className="boss-check__text">Date of Birth</p>
              </div>
              <div className="boss-check__info-cell">
                <p className="boss-check__text boss-check__text_role_primary">{dateOfBirth}</p>
              </div>
            </div>
            <div className="boss-check__info-row">
              <div className="boss-check__info-cell">
                <p className="boss-check__text">Email</p>
              </div>
              <div className="boss-check__info-cell">
                <p className="boss-check__text boss-check__text_role_primary boss-check__text_adjust_wrap">{email}</p>
              </div>
            </div>
            <div className="boss-check__info-row">
              <div className="boss-check__info-cell">
                <p className="boss-check__text">University</p>
              </div>
              <div className="boss-check__info-cell">
                <p className="boss-check__text boss-check__text_role_primary">{university}</p>
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
          {!disabled && (
            <button
              onClick={() => history.push(`/profile/${id}/edit`)}
              className="boss-button boss-button_type_small boss-button_role_edit boss-check__button"
            >
              Edit
            </button>
          )}
          {disabled ? (
            <AsyncButton
              onClick={() => enableClientRequested({ id })}
              className="boss-button boss-button_type_small boss-button_role_enable boss-check__button"
              text="Enable"
              pendingText="Enabling ..."
            />
          ) : (
            <AsyncButton
              onClick={this.handleDisable}
              className="boss-button boss-button_type_small boss-button_role_cancel boss-check__button"
              text="Disable"
              pendingText="Disabling ..."
            />
          )}
        </div>
      </div>
    );
  }
}

ProfileCard.propTypes = {
  client: PropTypes.object.isRequired,
  enableClientRequested: PropTypes.func.isRequired,
  disableClientRequested: PropTypes.func.isRequired,
};

export default ProfileCard;

export const PureToJSProfileCard = pureToJs(ProfileCard);
