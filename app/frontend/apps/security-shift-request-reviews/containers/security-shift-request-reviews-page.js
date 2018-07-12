import { connect } from 'react-redux';
import SecurityShiftRequestReviewsPage from '../components/security-shift-request-reviews-page';
import {
  getPendingSecurityShiftRequests,
  getCompletedSecurityShiftRequests,
  getVenueById,
  getWeekDaysWithCount,
} from '../selectors';

import {
  rejectSecurityShiftRequest,
  undoSecurityShiftRequest,
  acceptSecurityShiftRequest,
  editSecurityShiftRequest,
  changeWeekDay,
} from '../redux/actions';

const mapStateToProps = state => {
  return {
    pendingSecurityShiftRequests: getPendingSecurityShiftRequests(state),
    completedSecurityShiftRequests: getCompletedSecurityShiftRequests(state),
    getVenueById: getVenueById(state),
    startDate: state.getIn(['pageOptions', 'startDate']),
    endDate: state.getIn(['pageOptions', 'endDate']),
    date: state.getIn(['pageOptions', 'date']),
    weekDates: getWeekDaysWithCount(state),
  };
};

const mapDispatchToProps = {
  rejectSecurityShiftRequest,
  undoSecurityShiftRequest,
  acceptSecurityShiftRequest,
  editSecurityShiftRequest,
  changeWeekDay,
};

export default connect(mapStateToProps, mapDispatchToProps)(SecurityShiftRequestReviewsPage);
