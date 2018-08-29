import { connect } from 'react-redux';
import ClientsPage from '../components/clients-page';
import {
  getFilteredClients,
  nameFilterSelector,
  emailFilterSelector,
  statusFilterSelector,
  cardNumberFilterSelector,
} from '../selectors';
import { changeFilter } from '../redux/actions';

const mapStateToProps = state => {
  return {
    clients: getFilteredClients(state),
    total: state.get('clients').size,
    nameFilter: nameFilterSelector(state),
    emailFilter: emailFilterSelector(state),
    statusFilter: statusFilterSelector(state),
    cardNumberFilter: cardNumberFilterSelector(state),
  };
};

const mapDispatchToProps = {
  changeFilter,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClientsPage);
