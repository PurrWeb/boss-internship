import { connect } from 'react-redux';
import Page from '../components/page';
import { getFilteredCards } from '../selectors';
import {
  changeActiveFilter,
  changeCardNumberFilter,
  enadleCardRequested,
  disableCardRequested,
} from '../redux/actions';

const mapStateToProps = state => {
  return {
    cards: getFilteredCards(state),
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
