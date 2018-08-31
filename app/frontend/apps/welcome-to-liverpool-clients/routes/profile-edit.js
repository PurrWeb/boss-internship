import { connect } from 'react-redux';
import pureToJs from '~/hocs/pure-to-js';
import ProfileEdit from '../components/profile-edit';
import { getClientById } from '../selectors';
import { updateClientProfileRequested } from '../redux/actions';

const mapStateToProps = (state, ownProps) => {
  const client = getClientById(state, ownProps) ? getClientById(state, ownProps) : null;
  return {
    client,
  };
};

const mapDispatchToProps = {
  updateClientProfileRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(pureToJs(ProfileEdit));
