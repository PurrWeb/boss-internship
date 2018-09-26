import { connect } from 'react-redux';
import ClientsPage from '../components/clients-page';
import {
  getFilteredClients,
  nameFilterSelector,
  emailFilterSelector,
  statusFilterSelector,
  cardNumberFilterSelector,
} from '../selectors';
import {
  changeFilter,
  loadMore,
  getWtlClients,
  filterWtlClients,
  resendWtlClientVerificationEmailAction,
} from '../redux/actions';

const mapStateToProps = state => {
  return {
    clients: getFilteredClients(state),
    nameFilter: nameFilterSelector(state),
    emailFilter: emailFilterSelector(state),
    statusFilter: statusFilterSelector(state),
    cardNumberFilter: cardNumberFilterSelector(state),
    pageNumber: state.getIn(['pagination', 'pageNumber']),
    perPage: state.getIn(['pagination', 'perPage']),
    totalCount: state.getIn(['pagination', 'totalCount']),
    totalPages: state.getIn(['pagination', 'totalPages']),
  };
};

const mapDispatchToProps = {
  changeFilter,
  loadMore,
  getWtlClients,
  filterWtlClients,
  resendWtlClientVerificationEmailAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClientsPage);
