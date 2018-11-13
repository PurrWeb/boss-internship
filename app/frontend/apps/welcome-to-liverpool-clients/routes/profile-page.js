import { connect } from 'react-redux';
import pureToJs from '~/hocs/pure-to-js';
import ProfilePage from '../components/profile-page';
import { getClientById } from '../selectors';
import { enableClientRequested, disableClientRequested, getWtlClient, loadWtlClient } from '../redux/actions';

const mapStateToProps = (state, ownProps) => {
  const clientsProfile = state.get('profile');
  const client = clientsProfile || (getClientById(state, ownProps) ? getClientById(state, ownProps) : null);
  return {
    client,
    clientsProfile,
  };
};

const mapDispatchToProps = {
  enableClientRequested,
  disableClientRequested,
  getWtlClient,
  loadWtlClient,
};

export default connect(mapStateToProps, mapDispatchToProps)(pureToJs(ProfilePage));
