import { connect } from 'react-redux';
import Disciplinary from '../components/disciplinary';
import * as selectors from '../selectors';
import { addDisciplinary, disableDisciplinary, loadDisciplinaries } from '../redux/actions';

const mapStateToProps = state => {
  return {
    disciplinariesGroupedByLevel: selectors.getGroupedByLevelDisciplinaries(state),
    staffMemberFullName: selectors.staffMemberFullName(state),
    staffMemberId: state.getIn(['profile', 'staffMember', 'id']),
    startDate: state.getIn(['filter', 'startDate']),
    endDate: state.getIn(['filter', 'endDate']),
    show: state.getIn(['filter', 'show']),
    warnings: selectors.warningsSelector(state),
    warningLimits: selectors.warningLimitsSelector(state),
    warningOptions: selectors.warningOptions(state),
    companyName: state.get('companyName'),
    appealToName: state.get('appealToName'),
    currentUserFullName: state.get('currentUserFullName'),
    canCreateDisciplinary: state.getIn(['permissions', 'disciplinariesTab', 'canCreateDisciplinary']),
    disablePermissions: state.getIn(['permissions', 'disciplinariesTab', 'disciplinaries']),
  };
};

const mapDispatchToProps = {
  addDisciplinary,
  disableDisciplinary,
  loadDisciplinaries,
};

export default connect(mapStateToProps, mapDispatchToProps)(Disciplinary);
