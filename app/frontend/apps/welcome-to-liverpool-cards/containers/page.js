import { connect } from 'react-redux';
import Page from '../components/page';
import { getFilteredCards, numberFilterSelector } from '../selectors';
import {
  changeActiveFilter,
  changeCardNumberFilter,
  enadleCardRequested,
  disableCardRequested,
  loadMore,
} from '../redux/actions';

const mapStateToProps = state => {
  return {
    cards: getFilteredCards(state),
    cardNumberFilter: numberFilterSelector(state),
    pageNumber: state.getIn(['pagination', 'pageNumber']),
    perPage: state.getIn(['pagination', 'perPage']),
    totalCount: state.getIn(['pagination', 'totalCount']),
    totalPages: state.getIn(['pagination', 'totalPages']),
  };
};

const mapDispatchToProps = {
  changeActiveFilter,
  changeCardNumberFilter,
  enadleCardRequested,
  disableCardRequested,
  loadMore,
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
