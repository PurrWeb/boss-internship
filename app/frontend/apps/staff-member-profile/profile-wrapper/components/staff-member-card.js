import React from 'react';
import safeMoment from '~/lib/safe-moment';
import oFetch from 'o-fetch';
import axios from 'axios';
import AsyncButton from 'react-async-button';

import editAvatarModal from '~/lib/content-modal';
import bouncedEmailModal from '~/components/bounced-email-modal';
import utils from '~/lib/utils';

const StaffMemberCard = ({
  staffMember,
  jobType,
  onUpdateAvatar,
  onEditAvatar,
  currentPage,
  venues
}) => {
  const avatar = oFetch(staffMember, 'avatar');
  const fullName = `${oFetch(staffMember, 'first_name')} ${oFetch(
    staffMember,
    'surname',
  )}`;
  const masterVenueId = oFetch(staffMember, 'master_venue');
  const masterVenue = masterVenueId &&  _.find(venues, venue => { return oFetch(venue, 'id') === masterVenueId });
  const email = oFetch(staffMember, 'email');
  const phoneNumber = oFetch(staffMember, 'phone_number');
  const disabled = oFetch(staffMember, 'disabled');
  const isFlagged = oFetch(staffMember, 'is_flagged');
  const disabledByUser = oFetch(staffMember, 'disabled_by_user');
  const disabledAt = oFetch(staffMember, 'disabled_at');
  const disabledReason = oFetch(staffMember, 'disable_reason');
  const jobTypeName = oFetch(jobType, 'name');
  const jobTypeColor = oFetch(jobType, 'color');
  const bouncedEmail = oFetch(staffMember, 'bounced_email');
  const isSecurityStaff = oFetch(staffMember, 'is_security_staff');

  const renderPhoneNumber = phoneNumber => {
    return phoneNumber ? (
      <a
        href={`tel:${phoneNumber}`}
        className="boss-user-summary__link boss-user-summary__link_role_phone"
      >
        {phoneNumber}
      </a>
    ) : null;
  };

  const renderEmail = email => {
    return email ? renderEmailorBounced(email) : null;
  };

  const showBouncedModal = bouncedEmail => {
    bouncedEmailModal(bouncedEmail);
  };

  const renderEmailorBounced = email => {
    return bouncedEmail ? (
      <p
        onClick={() => showBouncedModal(bouncedEmail.toJS())}
        className="boss-user-summary__link boss-user-summary__link_role_alert-action"
      >
        {email}
      </p>
    ) : (
      <a
        href={`mailto:${email}`}
        className="boss-user-summary__link boss-user-summary__link_role_email"
      >
        {email}
      </a>
    );
  };

  const renderFullName = (fullName, disabled = false) => {
    return disabled ? `${fullName} (Disabled)` : fullName;
  };

  const renderMasterVenue = (masterVenue) => {
    return (
      <ul className="boss-user-summary__review-list">
        <li className="boss-user-summary__review-item boss-user-summary__review-item_role_venue">
          <span className="boss-user-summary__review-marked">{oFetch(masterVenue, 'name')}</span>
        </li>
      </ul>
    )
  }

  const renderCardContacts = (email, phoneNumber) => {
    return (
      <div key={1} className="boss-user-summary__contacts">
        {renderEmail(email)}
        {renderPhoneNumber(phoneNumber)}
      </div>
    );
  };
  const isActive = (currentPage, page) => {
    return currentPage === page ? 'boss-button_state_active' : '';
  };

  const renderCardActions = () => {
    return (
      <div key={2} className="boss-user-summary__meta">
        <a
          href={`profile`}
          className={`${isActive(
            currentPage,
            'profile',
          )} boss-button boss-button_type_small boss-button_role_profile boss-user-summary__switch`}
        >
          Profile
        </a>
        <a
          href={`holidays`}
          className={`${isActive(
            currentPage,
            'holidays',
          )} boss-button boss-button_type_small boss-button_role_holidays boss-user-summary__switch`}
        >
          Holidays
        </a>
        <a
          href={`owed_hours`}
          className={`${isActive(
            currentPage,
            'owed_hours',
          )} boss-button boss-button_type_small boss-button_role_timelog boss-user-summary__switch`}
        >
          Owed hours
        </a>
        {!isSecurityStaff && (
          <a
            href={`accessories`}
            className={`${isActive(
              currentPage,
              'accessories',
            )} boss-button boss-button_type_small boss-button_role_accessories boss-user-summary__switch`}
          >
            Accessories
          </a>
        )}
      </div>
    );
  };

  const renderdisabledContent = ({
    isFlagged,
    disabledByUser,
    disabledAt,
    disabledReason,
  }) => {
    const disabledAtFormatted = safeMoment
      .iso8601Parse(disabledAt)
      .format('Do MMMM YYYY');
    return (
      <ul className="boss-user-summary__review-list">
        <li className="boss-user-summary__review-item">
          <span className="boss-user-summary__review-label">
            Disabled by:{' '}
          </span>
          <span className="boss-user-summary__review-val">
            <span>
              {disabledByUser} on {disabledAtFormatted}
            </span>
          </span>
        </li>
        <li className="boss-user-summary__review-item">
          <span className="boss-user-summary__review-label">
            Reason for disabling:{' '}
          </span>
          <span className="boss-user-summary__review-val">
            {disabledReason}
          </span>
        </li>
        <li className="boss-user-summary__review-item">
          <span className="boss-button boss-button_type_small boss-button_type_no-behavior boss-button_role_exclamation boss-user-summary__label">
            { isFlagged ? 'Flagged' : 'Disabled' }
          </span>
        </li>
      </ul>
    );
  };

  return (
    <div className="boss-page-dashboard__user-summary">
      <div className="boss-user-summary">
        <div className="boss-user-summary__side">
          <div className="boss-user-summary__avatar">
            <div className="boss-user-summary__avatar-inner">
              <img src={avatar} alt="avatar" />
              {!disabled && (
                <button
                  className="boss-user-summary__avatar-icon boss-user-summary__avatar-icon_role_edit"
                  onClick={() => onEditAvatar()}
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="boss-user-summary__content">
          <div className="boss-user-summary__header">
            <h2 className="boss-user-summary__name">
              {renderFullName(fullName, disabled)}
            </h2>
            <span
              style={{ backgroundColor: jobTypeColor }}
              className="boss-button boss-button_type_small boss-button_type_no-behavior boss-user-summary__label"
            >
              {jobTypeName}
            </span>
          </div>

          {disabled &&
            renderdisabledContent({
              isFlagged,
              disabledByUser,
              disabledAt,
              disabledReason,
            })}

          {masterVenue && renderMasterVenue(masterVenue)}
          {[renderCardContacts(email, phoneNumber), renderCardActions()]}
        </div>
      </div>
    </div>
  );
};

export default StaffMemberCard;
