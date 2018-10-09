import { connect } from 'react-redux';
import Disciplinary from '../components/disciplinary';
import * as selectors from '../selectors';
import { addDisciplinary, disableDisciplinary, loadDisciplinaries } from '../redux/actions';

const mapStateToProps = state => {
  return {
    disciplinariesGroupedByLevel: selectors.getGroupedByLevelDisciplinaries(state),
    staffMemberId: state.getIn(['profile', 'staffMember', 'id']),
    startDate: state.getIn(['filter', 'startDate']),
    endDate: state.getIn(['filter', 'endDate']),
    show: state.getIn(['filter', 'show']),
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
