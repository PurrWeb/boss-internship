import { connect } from 'react-redux';
import oFetch from 'o-fetch';
import ShiftsPage from '../components/shifts-page';
import { getVenuesWithColor, getShiftsInformation, staffMemberIdSelector, staffMemberIsSecuritySelector } from '../selectors'

const mapStateToProps = state => {
  return {
    venues: getVenuesWithColor(state),
    pageOptions: state.get('pageOptions'),
    shiftsByDateAndVenue: getShiftsInformation(state),
    staffMemberId: staffMemberIdSelector(state),
  };
};

const mapDispatchToProps = {

};

export default connect(mapStateToProps)(ShiftsPage);