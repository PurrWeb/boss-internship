import React from 'react';
import { connect } from 'react-redux';
import SecurityRotaOverviewPage from '../components/security-rota-overview-page';
import { getSecurityRotaDayDataAction } from '../redux/actions';
import {
  getVenueStaffCountList,
  staffMembersSelector,
  rotaShiftsSelector,
  venuesSelector,
  rotasSelector,
  getBreakdown,
  getGroups,
} from '../selectors';

const mapStateToProps = state => {
  const staffMembers = staffMembersSelector(state);
  const rotaShifts = rotaShiftsSelector(state);
  const venues = venuesSelector(state);
  const rotas = rotasSelector(state);
  const isLoading = state.getIn(['securityRotaDay', 'loading']);
  const date = state.getIn(['securityRotaDay', 'date']);

  const breakdown = getBreakdown(state);
  const venueStaffCountList = getVenueStaffCountList(state);
  const venueStaffCountListIds = venueStaffCountList.map(i => i.id);

  const groups = getGroups(state).filter(group =>
    venueStaffCountListIds.includes(group.venue),
  );
  return {
    date,
    startDate: state.getIn(['securityRotaOverview', 'startDate']),
    endDate: state.getIn(['securityRotaOverview', 'endDate']),
    rotas,
    venueStaffCountList,
    staffMembers,
    rotaShifts,
    venues,
    isLoading,
    breakdown,
    groups,
  };
};

const mapDispatchToProps = {
  getSecurityRotaDayDataAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(
  SecurityRotaOverviewPage,
);
