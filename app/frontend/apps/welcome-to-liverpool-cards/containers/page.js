import { connect } from 'react-redux';
import Page from '../components/page';
import { getFilteredCards, numberFilterSelector } from '../selectors';
import {
  changeActiveFilter,
  changeCardNumberFilter,
  enadleCardRequested,
  disableCardRequested,
} from '../redux/actions';

const mapStateToProps = state => {
  return {
    cards: getFilteredCards(state),
    cardNumberFilter: numberFilterSelector(state),
    total: state.get('cards').size,
  };
};

const mapDispatchToProps = {
  changeActiveFilter,
  changeCardNumberFilter,
  enadleCardRequested,
  disableCardRequested,
};

export default connect(mapStateToProps, mapDispatchToProps)(Page);
