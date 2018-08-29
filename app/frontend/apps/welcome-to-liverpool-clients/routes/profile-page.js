import { connect } from 'react-redux';
import pureToJs from '~/hocs/pure-to-js';
import ProfilePage from '../components/profile-page';
import { getClientById } from '../selectors';
import {} from '../redux/actions';

const mapStateToProps = (state, ownProps) => {
  const client = getClientById(state, ownProps) ? getClientById(state, ownProps) : null;
  return {
    client,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(pureToJs(ProfilePage));
