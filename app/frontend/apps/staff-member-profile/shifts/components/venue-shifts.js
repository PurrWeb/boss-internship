import React, { Component } from 'react';
import PropTypes from 'prop-types';
import oFetch from 'o-fetch';
import { Collapse } from 'react-collapse';
import utils, { SECURITY_VENUE_TYPE } from '~/lib/utils'
import safeMoment from '~/lib/safe-moment'
import { appRoutes } from '~/lib/routes'

class VenueShifts extends Component {
  state = {
    isOpen: false,
  };

  toggleOpen = () => {
    this.setState((state) => ({ isOpen: !state.isOpen }));
  };

  renderShiftsRotaed(rotaShifts) {
    const rotaedList = rotaShifts.map(rotaShift => {
      return oFetch(rotaShift, 'formattedFromTo');
    });
    return (
      <p className="boss-timeline__text">
        <span className="boss-timeline__text-faded">Rotaed:</span> {rotaedList.size === 0 ? 'N/A' : rotaedList.join(', ')}
      </p>
    )
  }

  renderHoursAcceptancePeriodsFromTo(hoursAcceptancePeriods) {
    return hoursAcceptancePeriods.map(hoursAcceptancePeriod => {
      const formattedFromTo = oFetch(hoursAcceptancePeriod, 'formattedFromTo');
      const startsAt = oFetch(hoursAcceptancePeriod, 'startsAt');
      const endsAt = oFetch(hoursAcceptancePeriod, 'endsAt');
      const acceptedBy = oFetch(hoursAcceptancePeriod, 'acceptedBy');
      const acceptedAt = oFetch(hoursAcceptancePeriod, 'acceptedAt');
      const formattedAcceptedAt = safeMoment.iso8601Parse(acceptedAt).format(utils.commonDateFormat);
      const breaks = oFetch(hoursAcceptancePeriod, 'breaks');
      const breaksDiff = utils.getStartsEndsTimeDiff(breaks);
      const breaksTotalTime = utils.formattedTime(breaksDiff);
      const hoursAcceptanceDiff = utils.getTimeDiff(startsAt, endsAt);
      const hoursAcceptanceFormatted = utils.formattedTime(hoursAcceptanceDiff);

      return (
        <div key={oFetch(hoursAcceptancePeriod, 'id').toString()}>
          <p className="boss-timeline__text">
            <span className="boss-timeline__text-marked">{hoursAcceptanceFormatted}</span>
            <span className="boss-timeline__text-faded"> Accepted by </span>
            {acceptedBy}
            <span className="boss-timeline__text-faded"> on </span>
            {formattedAcceptedAt}
            {breaksDiff > 0 && (
              <span>
                <span className="boss-timeline__text-faded"> with </span>
                <span className="boss-timeline__text-marked">{breaksTotalTime}</span> breaks
              </span>
            )}
          </p>
          <p className="boss-timeline__text">
            <span className="boss-timeline__text-faded">From/To:</span> {formattedFromTo}
          </p>
        </div>
      )
    })
  }

  render() {
    const venueShifts = oFetch(this.props, 'venueShifts');
    const venueCombinedId = oFetch(this.props, 'venueId');
    const staffMemberId = oFetch(this.props, 'staffMemberId');
    const date = oFetch(this.props, 'date');
    const isOpen = oFetch(this.state, 'isOpen');
    const venueName = oFetch(venueShifts, 'venueName');
    const rotaShifts = oFetch(venueShifts, 'rotaShifts');
    const hoursAcceptancePeriods = oFetch(venueShifts, 'hoursAcceptancePeriods');

    const hasHoursAcceptancePeriods = hoursAcceptancePeriods.size > 0;

    const rotaShiftsDiff = utils.getStartsEndsTimeDiff(rotaShifts);
    const rotaShiftsTotalTime = utils.formattedTime(rotaShiftsDiff);

    const hoursAcceptancePeriodsDiff = utils.getStartsEndsTimeDiff(hoursAcceptancePeriods);
    const hoursAcceptancePeriodsTotalTime = utils.formattedTime(hoursAcceptancePeriodsDiff);

    const [venueType, stringVenueId] = venueCombinedId.split('_');
    const venueId = Number(stringVenueId);

    const isSecurityVenue = venueType === SECURITY_VENUE_TYPE

    return (
      <div className="boss-timeline__records">
        <div className="boss-timeline__record">
          <p className="boss-timeline__text boss-timeline__text_role_venue">{venueName}</p>
          <div className="boss-timeline__details">
            <div className="boss-timeline__details-header">
              <p className="boss-timeline__text boss-timeline__text_role_hours">
                <span className="boss-timeline__text-marked">{rotaShiftsTotalTime}</span> rotaed
                {!isSecurityVenue && (
                  <span>
                    <span className="boss-timeline__text-marked">{' '}{hoursAcceptancePeriodsTotalTime}{' '}</span>
                    <span>{' '}accepted</span>
                  </span>
                )}
              </p>
              <div
                onClick={this.toggleOpen}
                className={`boss-timeline__details-switch ${isOpen ? '' : 'boss-timeline__details-switch_state_closed'}`}
              >
                Toggle details
            </div>
            </div>
            <Collapse
              isOpened={isOpen}
              className={`boss-timeline__details-content`}
            >
              <div className="boss-timeline__details-inner">
                {this.renderShiftsRotaed(rotaShifts)}
                {!hasHoursAcceptancePeriods && <a href={isSecurityVenue ? appRoutes.securityRotaDaily(date) : appRoutes.rotaDaily(date, venueId)} target="_blank" className="boss-timeline__link boss-timeline__link_role_details">View Rota</a>}
              </div>
              <div className="boss-timeline__details-inner">
                {this.renderHoursAcceptancePeriodsFromTo(hoursAcceptancePeriods)}
                {hasHoursAcceptancePeriods && <a href={appRoutes.staffMemberHoursOverview(staffMemberId, date)} target="_blank" className="boss-timeline__link boss-timeline__link_role_details">View Details</a>}
              </div>
            </Collapse>
          </div>
        </div>
      </div>
    );
  }
}

VenueShifts.propTypes = {};

export default VenueShifts;
