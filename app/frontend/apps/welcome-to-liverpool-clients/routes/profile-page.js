import { connect } from 'react-redux';
import pureToJs from '~/hocs/pure-to-js';
import ProfilePage from '../components/profile-page';
import { getClientById } from '../selectors';
import { enadleClientRequested, disableClientRequested } from '../redux/actions';

const mapStateToProps = (state, ownProps) => {
  const client = getClientById(state, ownProps) ? getClientById(state, ownProps) : null;
  return {
    client,
  };
};

const mapDispatchToProps = {
  enadleClientRequested,
  disableClientRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(pureToJs(ProfilePage));
