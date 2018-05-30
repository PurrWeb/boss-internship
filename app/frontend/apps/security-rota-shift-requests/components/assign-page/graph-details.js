import React, { Component } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import safeMoment from '~/lib/safe-moment';
import utils from '~/lib/utils';

export class GraphDetails extends Component {
  render() {
    const graphDetails = oFetch(this.props, 'graphDetails');
    const staffTypes = oFetch(this.props, 'staffTypes');
    const venueTypes = oFetch(this.props, 'venueTypes');
    const staff = oFetch(graphDetails, 'staff');
    const originalShiftObject = oFetch(graphDetails, 'originalShiftObject');
    const avatarUrl = oFetch(staff, 'avatarUrl');
    const firstName = oFetch(staff, 'firstName');
    const surname = oFetch(staff, 'surname');
    const staffTypeId = oFetch(staff, 'staffTypeId');
    const preferredDays = oFetch(staff, 'preferredDays');
    const preferredHours = oFetch(staff, 'preferredHours');
    const venueId = oFetch(originalShiftObject, 'venueId');
    const startsAt = oFetch(originalShiftObject, 'startsAt');
    const endsAt = oFetch(originalShiftObject, 'endsAt');

    const staffType = staffTypes.find(st => st.id === staffTypeId);
    const venue = venueTypes.find(vt => vt.id === venueId);
    const staffTypeColor = staffType.color;
    const staffTypeName = staffType.name;
    const venueName = venue.name;

    const startTime = safeMoment.iso8601Parse(startsAt).format(utils.commonDateFormatTimeOnly());
    const endTime = safeMoment.iso8601Parse(endsAt).format(utils.commonDateFormatTimeOnly());
    return (
      <div className="boss-modal-window__content">
        <div className="boss-modal-window__group">
          <div className="boss-user-summary boss-user-summary_role_rotas-daily-tooltip">
            <div className="boss-user-summary__side">
              <div className="boss-user-summary__avatar">
                <div className="boss-user-summary__avatar-inner">
                  <img src={avatarUrl} alt="user avatar" className="boss-user-summary__pic" />
                </div>
              </div>
            </div>
            <div className="boss-user-summary__content">
              <div className="boss-user-summary__header">
                <h2 className="boss-user-summary__name">{`${firstName} ${surname}`}</h2>
                <p
                  className="boss-button boss-button_type_label boss-button_type_no-behavior boss-user-summary__label"
                  style={{ backgroundColor: staffTypeColor }}
                >
                  {staffTypeName}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="boss-modal-window__group">
          <p className="boss-modal-window__group-label">
            <span>Shift Information</span>
          </p>
          <div className="boss-summary">
            <ul className="boss-summary__list">
              <li className="boss-summary__item boss-summary__item_layout_row boss-summary__item_role_header">
                <p className="boss-summary__text boss-summary__text_context_row">Venue:</p>
                <p className="boss-summary__text boss-summary__text_marked boss-summary__text_adjust_break">
                  {venueName}
                </p>
              </li>
              <li className="boss-summary__item boss-summary__item_layout_row">
                <p className="boss-summary__text boss-summary__text_context_row">Times:</p>
                <p className="boss-summary__text boss-summary__text_marked">{startTime} - {endTime}</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="boss-modal-window__group">
          <p className="boss-modal-window__group-label">
            <span>Preferences</span>
          </p>
          <div className="boss-summary">
            <ul className="boss-summary__list">
              <li className="boss-summary__item boss-summary__item_layout_row boss-summary__item_role_header">
                <p className="boss-summary__text boss-summary__text_context_row">Weekly Hours:</p>
                <p className="boss-summary__text boss-summary__text_marked">{preferredHours || '-'}</p>
              </li>
              <li className="boss-summary__item boss-summary__item_layout_row">
                <p className="boss-summary__text boss-summary__text_context_row">Day Preferences:</p>
                <p className="boss-summary__text boss-summary__text_marked boss-summary__text_adjust_break">
                  {preferredDays || '-'}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default GraphDetails;
