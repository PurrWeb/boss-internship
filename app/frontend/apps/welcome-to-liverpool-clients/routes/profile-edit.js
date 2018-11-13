import { connect } from 'react-redux';
import pureToJs from '~/hocs/pure-to-js';
import ProfileEdit from '../components/profile-edit';
import { getClientById } from '../selectors';
import { updateClientProfileRequested, getWtlClient, loadWtlClient } from '../redux/actions';

const mapStateToProps = (state, ownProps) => {
  const clientsProfile = state.get('profile');
  const client = clientsProfile || (getClientById(state, ownProps) ? getClientById(state, ownProps) : null);
  const universities = state.get('universities');

  return {
    client,
    clientsProfile,
    universities,
  };
};

const mapDispatchToProps = {
  updateClientProfileRequested,
  getWtlClient,
  loadWtlClient,
};

export default connect(mapStateToProps, mapDispatchToProps)(pureToJs(ProfileEdit));
