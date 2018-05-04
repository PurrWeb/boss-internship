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

@connect(mapStateToProps, mapDispatchToProps)
export class PaymentsPageUI extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      requestInProgress: false
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
      requestInProgress: true
    });
    this.props.actions.filterPayments({ accessToken, staffMemberId, filterParams })
      .then(() => {
        this.setState({
          requestInProgress: false
        })
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

  render() {
    const payments = oFetch(this.props, 'payments');
    const paymentFilter = oFetch(this.props, 'paymentFilter');
    const [mFilterStartDate, mFilterEndDate, filterStatusFilter] = oFetch(paymentFilter, 'mStartDate', 'mEndDate', 'statusFilter');
    const requestInProgress = oFetch(this.state, 'requestInProgress');

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
							{ !requestInProgress && <PaymentTimeline payments={payments}/> }
              <div className="boss-board__manager-actions">
              </div>
            </div>
          </div>
        </div>
      </section>
    </ProfileWrapper>;
  }
}
