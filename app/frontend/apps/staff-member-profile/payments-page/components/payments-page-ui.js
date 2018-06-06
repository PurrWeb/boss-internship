import React from 'react';
import { connect } from 'react-redux';
import { appRoutes } from "~/lib/routes";
import { bindActionCreators } from 'redux';
import ProfileWrapper from '../../profile-wrapper';
import { PaymentFilter, queryParamValues } from './payment-filter';
import { PaymentTimeline } from './payment-timeline';
import URLSearchParams from 'url-search-params';``
import { filterPayments } from '../actions';
import oFetch from 'o-fetch';

const mapStateToProps = (state) => {
  const globalState = oFetch(state.toJS(), 'global');
  return {
    accessToken: oFetch(globalState, 'accessToken'),
    staffMember: oFetch(globalState, 'staffMember'),
    payments: oFetch(globalState, 'payments'),
    paymentFilter: oFetch(globalState, 'paymentFilter')
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: bindActionCreators({
      filterPayments
    }, dispatch)
  };
}

const PAGE_SIZE = 6;
@connect(mapStateToProps, mapDispatchToProps)
export class PaymentsPageUI extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      requestInProgress: false,
      displayedPayments: props.payments.slice(0, PAGE_SIZE),
    }
  }

  onPaymentFilterUpdate(filterParams) {
    //One request at a time
    if(oFetch(this.state, 'requestInProgress')) {
      return null;
    }

    const staffMember = oFetch(this.props, 'staffMember');
    const accessToken = oFetch(this.props, 'accessToken');
    const staffMemberId = oFetch(staffMember, 'id');

    this.updateHistoryForFilter({ staffMemberId, filterParams });
    this.setState({
      requestInProgress: true,
      displayedPayments: []
    });
    this.props.actions.filterPayments({ accessToken, staffMemberId, filterParams })
      .then((something) => {
        this.setState({
          requestInProgress: false,
          displayedPayments: this.props.payments.slice(0, PAGE_SIZE),
        })
      });
  }

  getLoadMoreSizes = () => {
    const payments = oFetch(this.props, 'payments');
    const paymentCount = oFetch(payments, 'length');
    const displayedPayments = oFetch(this.state, 'displayedPayments');
    const displayedPaymentCount = oFetch(displayedPayments, 'length');

    let loadSize = PAGE_SIZE;
    if ((paymentCount - displayedPaymentCount) < PAGE_SIZE) {
      loadSize = paymentCount - displayedPaymentCount;
    }

    return { currentSize: displayedPaymentCount, loadSize };
  };

  loadMore = () => {
    this.setState(state => {
      const { currentSize, loadSize } = this.getLoadMoreSizes();
      const newPayments = this.props.payments.slice(
        currentSize,
        currentSize + loadSize,
      );

      return {
        displayedPayments: state.displayedPayments.concat(newPayments),
      };
    });
  }

  updateHistoryForFilter(params) {
    const staffMemberId = oFetch(params, 'staffMemberId');
    const filterParams = oFetch(params, 'filterParams');
    const queryString = new URLSearchParams(window.location.search);
    const queryParamsValues = queryParamValues(filterParams);

    for (let key in queryParamsValues) {
      queryString.set(key, queryParamsValues[key]);
    }

    const url = appRoutes.staffMemberPayments(staffMemberId, queryParamsValues);
    window.history.pushState('', '', url);
  }

  renderLoadMore() {
    return <div className="boss-staff-summary__actions">
      <button
        onClick={this.loadMore}
        className="boss-button boss-button_role_load-more boss-button_adjust_full-mobile"
      >
        Load More
      </button>
    </div>;
  }

  render() {
    const payments = oFetch(this.props, 'payments');
    const paymentCount = oFetch(payments, 'length');

    const paymentFilter = oFetch(this.props, 'paymentFilter');
    const [mFilterStartDate, mFilterEndDate, filterStatusFilter] = oFetch(paymentFilter, 'mStartDate', 'mEndDate', 'statusFilter');
    const requestInProgress = oFetch(this.state, 'requestInProgress');

    const displayedPayments = oFetch(this.state, 'displayedPayments');
    const displayedPaymentCount = oFetch(displayedPayments, 'length');

    const showLoadMore = !requestInProgress && (paymentCount > 0) && (paymentCount > displayedPaymentCount);

    return <ProfileWrapper currentPage="payments">
      <section className="boss-board">
        <header className="boss-board__header">
          <h2 className="boss-board__title">Payments</h2>
        </header>
        <div className="boss-board__main">
          <div className="boss-board__manager">
            <div className="boss-board__manager-group boss-board__manager-group_role_data">
              <PaymentFilter requestInProgress={requestInProgress} mStartDate={mFilterStartDate} mEndDate={mFilterEndDate} statusFilter={filterStatusFilter} onUpdate={this.onPaymentFilterUpdate.bind(this)} />
              { requestInProgress && <div className="boss-spinner" />}
							{ !requestInProgress && <PaymentTimeline payments={displayedPayments}/> }
              <div className="boss-board__manager-actions">
                { showLoadMore && this.renderLoadMore() }
              </div>
            </div>
          </div>
        </div>
      </section>
    </ProfileWrapper>;
  }
}
