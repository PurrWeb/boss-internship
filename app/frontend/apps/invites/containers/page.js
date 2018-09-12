import { connect } from 'react-redux';
import Page from '../components/page';
import { invitesFilteredByAllFilters, venuesSelector } from '../selectors';
import {
  changeRoleFilter,
  changeStatusFilter,
  inviteUserRequested,
  revokeInviteRequested,
} from '../redux/actions';

const mapStateToProps = state => {
  return {
    filters: state.get('filters'),
    invites: invitesFilteredByAllFilters(state),
    venues: venuesSelector(state),
  };
};

const mapDispatchToProps = {
  changeRoleFilter,
  changeStatusFilter,
  inviteUserRequested,
  revokeInviteRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
